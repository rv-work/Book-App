import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../lib/db.js";

export const signup = async (req, res) => {
  try {
    const { role, name, email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (role, name, email, password) VALUES (?, ?, ?, ?)",
      [role, name, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId }, "secretkey", { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: { id: result.insertId, name, email, role },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ msg: "User not found" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "7d" });

    res.status(200).json({ success: true, msg: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    let token = null;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ msg: "No token. Auth denied" });

    const decoded = jwt.verify(token, "secretkey");

    const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "User not found" });

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
