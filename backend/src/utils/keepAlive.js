const http = require("http");
const env = require("../config/env");

const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const startKeepAlive = () => {
  console.log(`[Keep-Alive] Pinging /health every 10 minutes to prevent Render sleep`);

  setInterval(() => {
    const options = {
      hostname: "localhost",
      port: env.port,
      path: "/api/health",
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const status = res.statusCode === 200 ? "✅" : "⚠️";
        console.log(`[Keep-Alive] ${status} Health check — Status: ${res.statusCode}`);
      });
    });

    req.on("error", (error) => {
      console.log(`[Keep-Alive] ❌ Ping failed: ${error.message}`);
    });

    req.on("timeout", () => {
      req.destroy();
      console.log(`[Keep-Alive] ⏱️  Ping timed out`);
    });

    req.end();
  }, KEEP_ALIVE_INTERVAL_MS);
};

module.exports = { startKeepAlive };
