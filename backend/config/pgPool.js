const { Pool } = require("pg");
require("dotenv").config();

const pgPool = new Pool({
    host: process.env.PG_HOST || "localhost",
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "postgres",
    database: process.env.PG_DATABASE || "ciphersql_sandbox",
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
});

pgPool.query("SELECT 1")
    .then(() => console.log("Connected to PostgreSQL Successfully"))
    .catch((err) => console.log("PostgreSQL connection error:", err.message));

module.exports = pgPool;