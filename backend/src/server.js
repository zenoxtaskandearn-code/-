const app = require("./app");
const env = require("./config/env");
const { pool } = require("./db/pool");

const start = async () => {
  try {
    await pool.query("SELECT 1");
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
