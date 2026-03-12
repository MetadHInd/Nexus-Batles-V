/**
 * Script de diagnóstico para verificar la conexión a Pinecone
 * Prueba si el sistema de memoria está funcionando correctamente
 */

import { config } from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

// Cargar variables de entorno
config();

async function testPineconeConnection() {
  console.log('🔍 Testing Pinecone Connection...\n');

  try {
    // 1. Verificar variables de entorno
    console.log('📋 Environment Variables:');
    console.log(`PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`PINECONE_INDEX_NAME: ${process.env.PINECONE_INDEX_NAME || 'galatea-core-prod'}`);
    console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log('');

    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in .env file');
    }

    // 2. Conectar a Pinecone
    console.log('🔌 Connecting to Pinecone...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // 3. Listar índices
    console.log('📊 Listing indexes...');
    const indexes = await pinecone.listIndexes();
    console.log(`Found ${indexes.indexes?.length || 0} indexes:`);
    indexes.indexes?.forEach((index) => {
      console.log(`  - ${index.name} (${index.dimension} dimensions, ${index.metric} metric)`);
    });
    console.log('');

    // 4. Verificar índice específico
    const indexName = process.env.PINECONE_INDEX_NAME || 'galatea-core-prod';
    console.log(`🔍 Checking index: ${indexName}`);

    try {
      const indexDescription = await pinecone.describeIndex(indexName);
      console.log(`✅ Index found!`);
      console.log(`  - Name: ${indexDescription.name}`);
      console.log(`  - Dimension: ${indexDescription.dimension}`);
      console.log(`  - Metric: ${indexDescription.metric}`);
      console.log(`  - Host: ${indexDescription.host}`);
      console.log(`  - Status: ${(indexDescription as any).status?.state || 'Unknown'}`);
      console.log('');

      // 5. Conectar al índice y verificar estadísticas
      console.log('📈 Getting index statistics...');
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      console.log(`  - Total vectors: ${stats.totalRecordCount || 0}`);
      console.log(`  - Namespaces: ${Object.keys(stats.namespaces || {}).length}`);

      if (stats.namespaces) {
        Object.entries(stats.namespaces).forEach(([ns, data]) => {
          console.log(`    - ${ns}: ${(data as any).recordCount || 0} vectors`);
        });
      }
      console.log('');

      // 6. Test de escritura (opcional)
      console.log('✏️ Testing write operation...');
      const testNamespace = 'test-connection';
      await index.namespace(testNamespace).upsert([
        {
          id: 'test-vector-' + Date.now(),
          values: Array(1536).fill(0.1), // Dimensión de text-embedding-3-small
          metadata: {
            test: true,
            timestamp: new Date().toISOString(),
          },
        },
      ]);
      console.log('✅ Write test successful!');
      console.log('');

      // 7. Verificar namespace manager-assistant
      console.log('🔍 Checking manager-assistant namespace...');
      const managerNamespace = 'manager-assistant';
      const managerStats = stats.namespaces?.[managerNamespace];
      if (managerStats) {
        console.log(`✅ Namespace found with ${(managerStats as any).recordCount || 0} vectors`);
      } else {
        console.log('⚠️ Namespace not found - will be created on first write');
      }
      console.log('');

      console.log('✅ All tests passed! Pinecone connection is working correctly.');
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        console.error(`❌ Index "${indexName}" does not exist!`);
        console.error('Available indexes:', indexes.indexes?.map((i) => i.name).join(', '));
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error('❌ Error testing Pinecone connection:');
    console.error(error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Ejecutar el test
testPineconeConnection()
  .then(() => {
    console.log('\n✅ Pinecone connection test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Pinecone connection test failed!', error);
    process.exit(1);
  });
