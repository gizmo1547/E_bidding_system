import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Database connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "test",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit the app if DB connection fails
  } else {
    console.log("Connected to the database successfully!");
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// Test route
app.get("/", (req, res) => {
  res.json("Hello, this is the backend from here to there! :)");
});

// Fetch all users (for testing purposes)
app.get("/users", (req, res) => {
  const q = "SELECT * FROM user";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    return res.json(data);
  });
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// User registration route
app.post("/users", async (req, res) => {
  const { username, password, email, userAnswer, correctAnswer } = req.body;

  // Validate arithmetic question
  if (parseInt(userAnswer) !== parseInt(correctAnswer)) {
    return res.status(400).json({ message: "Incorrect arithmetic answer." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const q =
    "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, 'Visitor', 0, 0, 0, 0, 0, 0, 1, NOW())";

  const values = [username, hashedPassword, email];

  db.query(q, values, (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Registration successful" });
  });
});

// User login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT * FROM user WHERE Username = ?";

  db.query(q, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const userPayload = { id: user.UserID, role: user.Role };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET || "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
});

// Fetch user data (protected route)
app.get("/user-data", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const userQuery = "SELECT * FROM user WHERE UserID = ?";
  const itemsQuery = "SELECT * FROM item WHERE OwnerID = ?";

  db.query(userQuery, [userId], (err, userData) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (userData.length === 0) return res.status(404).json({ message: "User not found" });

    db.query(itemsQuery, [userId], (err, itemsData) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({
        user: userData[0],
        items: itemsData,
      });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});