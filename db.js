import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("connect", () => {
  console.log("Database connection pool established successfully.");
});
pool.on("error", (err) => {
  console.log("Unexpected error on idle database client", err);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB connection failed:", err);
  else console.log("DB connected:", res.rows[0]);
});
export default pool;
