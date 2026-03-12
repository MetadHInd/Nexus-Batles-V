#!/usr/bin/env node
/**
 * Script de prueba para el endpoint de exportación de customers
 * Uso: node test-customer-export.js [format] [startDate] [endDate]
 * 
 * Ejemplos:
 *   node test-customer-export.js excel
 *   node test-customer-export.js csv 2025-01-01 2025-01-31
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const JWT_TOKEN = process.env.JWT_TOKEN || 'YOUR_JWT_TOKEN_HERE';

// Parsear argumentos
const format = process.argv[2] || 'excel';
const startDate = process.argv[3] || null;
const endDate = process.argv[4] || null;

// Construir query params
const params = new URLSearchParams();
params.append('format', format);
if (startDate) params.append('startDate', startDate);
if (endDate) params.append('endDate', endDate);

const url = `${API_BASE_URL}/api/customers/export/data?${params.toString()}`;

console.log('🚀 Testing Customer Export Endpoint');
console.log('=====================================');
console.log(`URL: ${url}`);
console.log(`Format: ${format}`);
console.log(`Start Date: ${startDate || 'default (last 30 days)'}`);
console.log(`End Date: ${endDate || 'default (today)'}`);
console.log('=====================================\n');

// ============================================================================
// REALIZAR REQUEST
// ============================================================================
const urlObj = new URL(url);
const protocol = urlObj.protocol === 'https:' ? https : http;

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port,
  path: urlObj.pathname + urlObj.search,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
  },
};

const req = protocol.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  console.log(`Content-Disposition: ${res.headers['content-disposition']}`);
  console.log('');

  if (res.statusCode !== 200) {
    let errorBody = '';
    res.on('data', (chunk) => {
      errorBody += chunk;
    });
    res.on('end', () => {
      console.error('❌ Error Response:');
      console.error(errorBody);
    });
    return;
  }

  // Extraer filename del header Content-Disposition
  const disposition = res.headers['content-disposition'];
  let filename = `customers_export.${format === 'csv' ? 'csv' : 'xlsx'}`;
  
  if (disposition && disposition.includes('filename=')) {
    const matches = /filename="?([^"]+)"?/i.exec(disposition);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  const filePath = path.join(__dirname, 'exports', filename);
  
  // Crear directorio exports si no existe
  if (!fs.existsSync(path.join(__dirname, 'exports'))) {
    fs.mkdirSync(path.join(__dirname, 'exports'));
  }

  // Guardar archivo
  const fileStream = fs.createWriteStream(filePath);
  let receivedBytes = 0;

  res.on('data', (chunk) => {
    receivedBytes += chunk.length;
    fileStream.write(chunk);
  });

  res.on('end', () => {
    fileStream.end();
    console.log(`✅ File saved successfully!`);
    console.log(`📁 Location: ${filePath}`);
    console.log(`📊 Size: ${(receivedBytes / 1024).toFixed(2)} KB`);
  });

  fileStream.on('error', (err) => {
    console.error('❌ Error writing file:', err.message);
  });
});

req.on('error', (err) => {
  console.error('❌ Request Error:', err.message);
});

req.end();
