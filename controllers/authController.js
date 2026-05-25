import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (username === undefined || username.trim() === "") {
      return res.status(400).json({ message: "Username cannot be blank" });
    }

    if (email === undefined || email.trim() === "") {
      return res.status(400).json({ message: "Email cannot be blank" });
    }

    if (password === undefined || password.trim() === "") {
      return res.status(400).json({ message: "Password cannot be blank" });
    }

    const checkUsernameExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim().toLowerCase()],
    );

    const checkEmailExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()],
    );

    if (checkUsernameExists.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Username is already registered" });
    }

    if (checkEmailExists.rows.length > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [
        username.trim().toLowerCase(),
        email.trim().toLowerCase(),
        hashedPassword,
      ],
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (email === undefined || email.trim() === "") {
      return res.status(400).json({ message: "Email cannot be blank" });
    }

    if (password === undefined || password.trim() === "") {
      return res.status(400).json({ message: "Password cannot be blank" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.trim().toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: payload,
    });
  } catch (err) {
    next(err);
  }
}
