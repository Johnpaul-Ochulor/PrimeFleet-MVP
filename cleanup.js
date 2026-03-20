import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanDB() {
  try {
    await client.connect();
    console.log("Connected to Render DB...");
    
    // Drop the tables that are causing the "Already Exists" or "Type Mismatch" errors
    await client.query('DROP TABLE IF EXISTS "ZoneRates" CASCADE;');
    await client.query('DROP TABLE IF EXISTS "Zones" CASCADE;');
    await client.query('DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;');
    
    console.log("✅ Database cleared! You now have a clean slate.");
  } catch (err) {
    console.error("❌ Error cleaning DB:", err.message);
  } finally {
    await client.end();
  }
}

cleanDB();