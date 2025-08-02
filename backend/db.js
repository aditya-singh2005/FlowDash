import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

const connectDB = async () => {
  try {
    await db.connect();
    console.log('✅ PostgreSQL connected successfully');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

export { db, connectDB };
