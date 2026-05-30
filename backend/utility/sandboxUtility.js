const pgPool = require("../config/pgPool.js");
const crypto = require("crypto");

/**
 * Creates a temp PG schema, runs setupSQL + userQuery, drops schema.
 */
async function runSandboxQuery(setupSQL, userQuery) {
  const schema = `sandbox_${crypto.randomUUID().replace(/-/g, "")}`;
  const client = await pgPool.connect();

  try {
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);
    await client.query(setupSQL);

    const result = await client.query(userQuery);
    const columns = result.fields?.map((f) => f.name) || [];
    const rows = result.rows || [];

    return { rows, columns, error: null };
  } catch (err) {
    return { rows: [], columns: [], error: err.message };
  } finally {
    try { await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`); } catch {}
    try { await client.query(`SET search_path TO public`); } catch {}
    client.release();
  }
}

/**
 * Compare user output with expected output (order-insensitive).
 */
function compareResults(userRows, expectedRows) {
  if (userRows.length !== expectedRows.length) return false;

  const serialize = (rows) =>
    rows
      .map((r) => JSON.stringify(Object.values(r)))
      .sort()
      .join("|");

  return serialize(userRows) === serialize(expectedRows);
}

module.exports = { runSandboxQuery, compareResults };