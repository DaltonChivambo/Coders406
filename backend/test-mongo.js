const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Tentando conectar ao MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/humai');
    console.log('✅ Conectado ao MongoDB');
    
    // Testar uma operação simples
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Coleções encontradas:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
  }
}

testConnection();

