# PowerShell Script for building, pushing, and deploying to Google Cloud Run
#
# USAGE:
#   .\deploy.ps1              # Runs all steps: Build, Sync Secrets, Deploy
#
#   INCLUDE-ONLY MODE:
#   .\deploy.ps1 -b           # Runs ONLY the Build and Push step
#   .\deploy.ps1 -e           # Runs ONLY the Sync Secrets step
#   .\deploy.ps1 -r           # Runs ONLY the Deploy step
#
#   EXCLUDE MODE:
#   .\deploy.ps1 -bx          # Runs all steps EXCEPT Build and Push
#   .\deploy.ps1 -ex          # Runs all steps EXCEPT Sync Secrets
#   .\deploy.ps1 -rx          # Runs all steps EXCEPT Deploy
#
param(
    [switch]$b, [switch]$e, [switch]$r,  # Include-only flags
    [switch]$bx, [switch]$ex, [switch]$rx # Exclude flags
)

# --- Configuration ---
$ProjectId = "galatea-production-462521"
$ServiceName = "galatea-authorization"
$Region = "us-west1"
$envFile = if (Test-Path ".env.production") { ".env.production" } else { ".env" }

# --- Script ---
$ErrorActionPreference = "Stop"

# --- Functions for Each Step ---

function Handle-Error {
    param($message)
    Write-Host "ERROR: $message" -ForegroundColor Red
    exit 1
}

function Build-And-Push-Image {
    Write-Host "--- Running Step: Build and Push Image ---" -ForegroundColor Magenta
    # 1. Authenticate Docker
    Write-Host "Step 1: Authenticating Docker with gcloud..." -ForegroundColor Cyan
    gcloud auth configure-docker ${Region}-docker.pkg.dev --quiet
    if ($LASTEXITCODE -ne 0) { Handle-Error "Failed to authenticate Docker." }

    # 2. Build
    $ImageUrl = "${Region}-docker.pkg.dev/${ProjectId}/${ServiceName}/${ServiceName}:latest"
    Write-Host "Step 2: Building Docker image: $ImageUrl" -ForegroundColor Cyan
    docker build -t $ImageUrl .
    if ($LASTEXITCODE -ne 0) { Handle-Error "Docker build failed." }

    # 3. Push
    Write-Host "Step 3: Pushing image to Artifact Registry..." -ForegroundColor Cyan
    docker push $ImageUrl
    if ($LASTEXITCODE -ne 0) { Handle-Error "Docker push failed." }
}

function Sync-Secrets {
    Write-Host "--- Running Step: Sync Secrets from .env ---" -ForegroundColor Magenta
    if (-not (Test-Path $envFile)) { Handle-Error ".env file not found." }

    Get-Content $envFile | ForEach-Object {
        $line = $_
        if ($line -match "^\s*#" -or -not $line.Trim()) { return }
        $parts = $line.Split("=", 2)
        if ($parts.Length -ne 2) { return }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        if (-not $value) {
            Write-Host "  - Skipping empty variable: $key" -ForegroundColor Yellow
            return
        }
        
        # Exclude GCP credential file paths, as they are not used in Cloud Run environment
        if ($key -eq "GOOGLE_APPLICATION_CREDENTIALS" -or $key -eq "FIREBASE_CREDENTIALS") {
            Write-Host "  - Skipping credential file variable: $key" -ForegroundColor Yellow
            return
        }

        $secretId = $key.ToLower().Replace("_", "-")
        Write-Host "  - Processing secret: $key -> $secretId"
        $output = & gcloud secrets describe $secretId --project=$ProjectId --format="value(name)" --quiet *>&1
        
        if ($output -like "*NOT_FOUND*") {
            Write-Host "    Secret does not exist. Creating..." -ForegroundColor Cyan
            gcloud secrets create $secretId --project=$ProjectId --replication-policy="automatic" --quiet
            if ($LASTEXITCODE -ne 0) { Handle-Error "Failed to create secret '$secretId'." }
        } elseif ($LASTEXITCODE -ne 0) {
            # Handle other potential errors from gcloud describe
            Handle-Error "Failed to describe secret '$secretId': $output"
        }
        
        $currentValue = gcloud secrets versions access latest --secret=$secretId --project=$ProjectId --quiet
        if ($currentValue -ne $value) {
            Write-Host "    Value has changed. Adding new version..." -ForegroundColor Yellow
            $tempFile = [System.IO.Path]::GetTempFileName()
            Set-Content -Path $tempFile -Value $value -NoNewline
            gcloud secrets versions add $secretId --project=$ProjectId --data-file=$tempFile --quiet
            if ($LASTEXITCODE -ne 0) { Handle-Error "Failed to add new version to secret '$secretId'." }
            Remove-Item $tempFile -Force
        } else {
            Write-Host "    Secret is already up-to-date. Skipping." -ForegroundColor Gray
        }
    }
}

function Deploy-To-CloudRun {
    Write-Host "--- Running Step: Deploy to Cloud Run ---" -ForegroundColor Magenta
    # Grant Permissions
    $ServiceAccount = "$(gcloud projects describe $ProjectId --format='value(projectNumber)')-compute@developer.gserviceaccount.com"
    Write-Host "Step 4: Granting Secret Accessor role to $ServiceAccount..." -ForegroundColor Cyan
    gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:$ServiceAccount" --role="roles/secretmanager.secretAccessor" --condition=None --quiet
    
    # Build the deploy command with environment variables from secrets
    $envVarsList = @()
    Get-Content $envFile | ForEach-Object {
        $line = $_
        if ($line -match "^\s*#" -or -not $line.Trim() -or ($line.Split("=", 2)).Length -ne 2) { return }
        $key = ($line.Split("=", 2))[0].Trim()
        $value = ($line.Split("=", 2))[1].Trim()
        if ($value -and $key -ne "GOOGLE_APPLICATION_CREDENTIALS" -and $key -ne "FIREBASE_CREDENTIALS") {
            $secretId = $key.ToLower().Replace("_", "-")
            $envVarsList += "$($key)=$($secretId):latest"
        }
    }
    
    $ImageUrl = "${Region}-docker.pkg.dev/${ProjectId}/${ServiceName}/${ServiceName}:latest"
    $deployCommand = "gcloud run deploy $ServiceName --image $ImageUrl --platform managed --region $Region --port 8080 --allow-unauthenticated --cpu-boost --memory=2Gi --timeout=600 --max-instances=100 --project=$ProjectId"
    if ($envVarsList.Count -gt 0) {
        $envVarsString = $envVarsList -join ","
        $deployCommand += " --update-secrets=`"$envVarsString`""
    }

    Write-Host "Step 5: Executing deployment command..." -ForegroundColor Cyan
    Write-Host "DEBUG: Deploy command: $deployCommand" -ForegroundColor Yellow
    Invoke-Expression $deployCommand
    if ($LASTEXITCODE -ne 0) { Handle-Error "Cloud Run deployment failed." }
}

# --- Main Control Flow ---

$runAll = $PSBoundParameters.Count -eq 0
$includeMode = $b.IsPresent -or $e.IsPresent -or $r.IsPresent

$runBuild = $false
$runSync = $false
$runDeploy = $false

if ($runAll) {
    $runBuild = $true
    $runSync = $true
    $runDeploy = $true
} elseif ($includeMode) {
    if ($b.IsPresent) { $runBuild = $true }
    if ($e.IsPresent) { $runSync = $true }
    if ($r.IsPresent) { $runDeploy = $true }
} else { # Exclude mode
    $runBuild = -not $bx.IsPresent
    $runSync = -not $ex.IsPresent
    $runDeploy = -not $rx.IsPresent
}

if ($runBuild) { Build-And-Push-Image }
if ($runSync) { Sync-Secrets }
if ($runDeploy) { Deploy-To-CloudRun }

$ServiceUrl = gcloud run services describe $ServiceName --platform managed --region $Region --format 'value(status.url)' 2>$null
Write-Host ""
Write-Host "Script finished successfully!" -ForegroundColor Green
if ($ServiceUrl) {
    Write-Host "Service URL: $ServiceUrl" -ForegroundColor Yellow
}
