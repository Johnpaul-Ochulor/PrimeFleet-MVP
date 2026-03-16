// test-db.js
import sequelize from './config/db.js';

async function testConnection() {
  try {
    console.log('⏳ Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('✅ CONNECTION SUCCESSFUL! Sequelize is talking to Postgres.');
    
    console.log('⏳ Attempting to sync tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ SYNC SUCCESSFUL! Your tables are now live on Render.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

testConnection();