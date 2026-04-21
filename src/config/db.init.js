import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

console.log("Minha URL é:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export { pool }