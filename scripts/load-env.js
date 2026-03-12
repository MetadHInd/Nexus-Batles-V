#!/usr/bin/env node

/**
 * 🔧 SCRIPT DE CARGA DE VARIABLES DE ENTORNO
 * 
 * Carga el archivo .env correcto según el ambiente (development, production, staging)
 * y ejecuta el comando especificado con esas variables.
 * 
 * Uso:
 *   node scripts/load-env.js development -- npm start
 *   node scripts/load-env.js production -- npm start
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Obtener el ambiente del primer argumento
const environment = process.argv[2] || 'development';

// Encontrar el índice del separador "--"
const separatorIndex = process.argv.indexOf('--');

if (separatorIndex === -1) {
  console.error('❌ Error: Debes especificar el comando a ejecutar después de "--"');
  console.error('Ejemplo: node scripts/load-env.js development -- npm start');
  process.exit(1);
}

// Obtener el comando y sus argumentos
const command = process.argv[separatorIndex + 1];
const commandArgs = process.argv.slice(separatorIndex + 2);

// Determinar el archivo .env a cargar
const envFiles = {
  development: '.env.development',
  production: '.env.production',
  staging: '.env.staging',
  test: '.env.test',
};

const envFile = envFiles[environment] || '.env';
const envPath = path.join(__dirname, '..', envFile);
const fallbackPath = path.join(__dirname, '..', '.env');

// Verificar si existe el archivo de entorno
let selectedEnvFile = fallbackPath;

if (fs.existsSync(envPath)) {
  selectedEnvFile = envPath;
  console.log(`✅ Cargando variables de entorno desde: ${envFile}`);
} else {
  console.log(`⚠️  Archivo ${envFile} no encontrado. Usando .env por defecto`);
  if (!fs.existsSync(fallbackPath)) {
    console.error('❌ Error: No se encontró ningún archivo .env');
    process.exit(1);
  }
}

// Cargar variables de entorno manualmente
const envConfig = {};
const envContent = fs.readFileSync(selectedEnvFile, 'utf-8');

envContent.split('\n').forEach(line => {
  // Ignorar comentarios y líneas vacías
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('#')) {
    return;
  }

  // Parsear línea KEY=VALUE
  const match = trimmedLine.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();

    // Remover comillas si existen
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    envConfig[key] = value;
  }
});

// Agregar NODE_ENV basado en el ambiente
envConfig.NODE_ENV = environment;

// Combinar con las variables de entorno existentes
const env = { ...process.env, ...envConfig };

console.log(`🚀 Ejecutando: ${command} ${commandArgs.join(' ')}`);
console.log(`📦 Ambiente: ${environment}`);
console.log(`🔧 NODE_ENV: ${env.NODE_ENV}`);
console.log('');

// Ejecutar el comando con las variables de entorno cargadas
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true,
  env,
});

// Manejar la salida del proceso hijo
child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('❌ Error ejecutando comando:', error.message);
  process.exit(1);
});
