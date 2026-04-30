const fs = require("fs");
const path = require("path");
require("../config/env");
const { pool } = require("./pool");

const runMigrations = async () => {
  const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  try {
    await pool.query(sql);
    console.log("Schema migration completed.");

    const migrationsDir = path.join(process.cwd(), "sql");
    const files = fs.readdirSync(migrationsDir);
    const migrationFiles = files.filter(f => f.startsWith("migrate_") && f.endsWith(".sql"));

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const migrationSql = fs.readFileSync(filePath, "utf8");
      try {
        await pool.query(migrationSql);
        console.log(`Applied: ${file}`);
      } catch (error) {
        if (error.code === "42701") {
          console.log(`Skipped (already exists): ${file}`);
        } else {
          console.error(`Failed: ${file}`, error.message);
        }
      }
    }

    console.log("All migrations completed.");
  } catch (error) {
    console.error("Migration failed", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

runMigrations();
