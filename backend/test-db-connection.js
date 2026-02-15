import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Database connection successful!');
    console.log(`Connected to: ${process.env.DB_NAME}`);

    // ทดสอบ query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`✅ Found ${rows[0].count} restaurants`);

    await connection.end();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running');
    console.error('2. Database "mini_grabfood_test" exists');
    console.error('3. Password in .env.test is correct');
  }
}

testConnection();