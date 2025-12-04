
import { Pool } from '@neondatabase/serverless';

// Instructions:
// 1. Create a `.env` file in the root of the project.
// 2. Add your NeonDB connection string to the `.env` file:
//    DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
// 3. Make sure to install `dotenv` by running: npm install dotenv
// 4. Run this script from the root of your project: node test-db.js

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDatabaseConnection() {
  console.log('🔍 Testing NeonDB Connection...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set. Please check your .env file.');
    return;
  }

  const client = await pool.connect();
  try {
    // Test connection
    await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');

    // Fetch and display table information
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    if (tables.rows.length === 0) {
      console.log('📋 No tables found in the database.');
      return;
    }

    console.log('\n📋 Tables in database:');
    for (const table of tables.rows) {
      console.log(`  ✓ ${table.table_name}`);
    }

  } catch (err) {
    console.error('❌ Database connection test failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testDatabaseConnection();
