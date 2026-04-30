const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verify() {
  try {
    const res = await pool.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_name = 'task_completions'
       ORDER BY ordinal_position`
    );
    console.log('task_completions columns:');
    res.rows.forEach(r => console.log(`  ${r.column_name}  (${r.data_type})  nullable: ${r.is_nullable}`));
  } catch (e) {
    console.error(e.message);
  } finally {
    await pool.end();
  }
}

verify();
