import express from "express";
import blogRouter from "./routes/blogs.js";
import authRouter from "./routes/auth.js";
import pool from "./db.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/posts", blogRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  console.error("Error stack:", err);
  res.status(500).json({ message: "Oops! Something went wrong." });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
