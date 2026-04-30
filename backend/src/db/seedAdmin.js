const bcrypt = require("bcryptjs");
const env = require("../config/env");
const { query, withTransaction, pool } = require("./pool");

const seedAdmin = async () => {
  const adminEmail = env.adminSeed.email.toLowerCase();
  const existing = await query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [
    adminEmail,
  ]);

  if (existing.rows.length > 0) {
    console.log("Admin already exists. Skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminSeed.password, 10);

  await withTransaction(async (client) => {
    const adminResult = await client.query(
      `INSERT INTO users (name, email, phone, profession, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5, 'ADMIN', 'ACTIVE')
       RETURNING id, email`,
      [
        env.adminSeed.name,
        adminEmail,
        env.adminSeed.phone,
        env.adminSeed.profession,
        passwordHash,
      ]
    );

    await client.query(
      `INSERT INTO wallets (user_id, balance, total_earned, total_withdrawn)
       VALUES ($1, 0, 0, 0)`,
      [adminResult.rows[0].id]
    );

    await client.query(
      `INSERT INTO user_settings (user_id, notify_email, notify_push, profile_public)
       VALUES ($1, true, true, false)`,
      [adminResult.rows[0].id]
    );
  });

  console.log(`Admin seeded: ${adminEmail}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Admin seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
