const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "bookseller"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL database");
});

const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  if (!passwordRegex.test(password)) return res.status(400).json({ message: "Password must be at least 8 characters and contain a special character" });

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length > 0) return res.status(400).json({ message: "Username already exists" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "Error registering user" });
        res.json({ message: "User registered successfully" });
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET || "secret123", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  });
});

app.post("/api/books", (req, res) => {
  const { title, author, price, description, cover_image } = req.body;
  if (!title || !author || price === undefined) return res.status(400).json({ message: "Title, author, and price required" });

  db.query(
    "INSERT INTO books (title, author, price, description, cover_image) VALUES (?, ?, ?, ?, ?)",
    [title, author, price, description || "", cover_image || ""],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error adding book" });
      res.json({ message: "Book added successfully", bookId: result.insertId });
    }
  );
});

app.get("/api/books", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching books" });
    res.json(results);
  });
});

app.get("/api/books/:id", (req, res) => {
  db.query("SELECT * FROM books WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching book" });
    if (results.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(results[0]);
  });
});

app.put("/api/books/:id", (req, res) => {
  const { title, author, price, description, cover_image } = req.body;
  db.query(
    "UPDATE books SET title=?, author=?, price=?, description=?, cover_image=? WHERE id=?",
    [title, author, price, description || "", cover_image || "", req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Error updating book" });
      res.json({ message: "Book updated successfully" });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error deleting book" });
    res.json({ message: "Book deleted successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
