//index.js
import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const app = express()
//Connecting to data base
const db = mysql.createConnection({
   host:"localhost",//change if need it
   user:"root",//change if need it
   password:"GermanVoronovich",//change to your password
   database:"e_bidding_system"
})


//IF there is a auth problem
//ALTER USER 'root'@localhost' IDENTIFIED WITH mysql_native_password BY 'GermanVoronovich';


app.use(express.json())
app.use(cors())



//Test get method
app.get("/", (req,res)=>{
    res.json("hello this is the backend from here to there:)")
})

//Test User table from mySQL
app.get("/users", (req,res)=>{
  const q = "SELECT * FROM user"
db.query(q,(err,data)=>{
    if(err) return res.json(err)
        return res.json(data)
  })
})

// Generate arithmetic question
app.get('/generate-question', (req, res) => {
  const operators = ['+', '-', '*'];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  res.json({ num1, num2, operator });
});


/*
//Testing post method
app.post("/users", (req, res) => {
  const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
  
  const values = [
    req.body.username,          // "Bruce"
    req.body.password,          // "23er"
    req.body.email,             // "Bruce@example.com"
    req.body.role || 'User',    // Use default 'User' if Role is missing
    req.body.accountBalance,    // 1.5
    req.body.isVIP || 0,        // Use default 0 if isVIP is missing
    req.body.isSuspended || 0,  // Use default 0 if isSuspended is missing
    req.body.suspensionCount || 0, // 0
    req.body.averageRating || 0,   // 4.5
    req.body.numberOfRatings || 0, // 0
    req.body.numberOfTransactions || 0, // 10
    req.body.isActive || 1  
  
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
*/

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

/*// Registration route
app.post("/users", async (req, res) => {
  const { username, password, email, userAnswer, correctAnswer } = req.body;

  // Validate arithmetic question
  if (parseInt(userAnswer) !== parseInt(correctAnswer)) {
    return res.status(400).json({ message: 'Incorrect arithmetic answer.' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, 'Visitor', 0, 0, 0, 0, 0, 0, 1, NOW())";

    const values = [
      username,
      hashedPassword,
      email
    ];

    // Execute the query
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: 'Registration successful' });
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}); */

// Registration route
app.post("/users", async (req, res) => {
  const { username, password, email, userAnswer, correctAnswer } = req.body;

  // Validate arithmetic question
  if (parseInt(userAnswer) !== parseInt(correctAnswer)) {
      return res.status(400).json({ message: 'Incorrect arithmetic answer.' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, 'Visitor', 0, 0, 0, 0, 0, 0, 1, NOW())";

  const values = [
      username,
      hashedPassword,
      email
  ];

  // Execute the query
  db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: 'Registration successful' });
  });
});
  

// Route to get user data
app.get('/user-data', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch user information from the database
  const userQuery = "SELECT * FROM user WHERE UserID = ?";
  const itemsQuery = "SELECT * FROM item WHERE OwnerID = ?";//items

  db.query(userQuery, [userId], (err, userData) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (userData.length === 0) return res.status(404).json({ message: 'User not found' });

    db.query(itemsQuery, [userId], (err, itemsData) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.json({
        user: userData[0],
        items: itemsData,
      });
    });
  });
});



// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Query to find the user by username
  const query = "SELECT * FROM user WHERE Username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      // If no user is found, respond with an error
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Fetch the user from the result
    const user = result[0];

    // Check if the provided password matches the password from the database
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (passwordMatch) {
      // If password matches, generate a JWT token
      const userPayload = { id: user.UserID, role: user.Role }; // Adjust 'UserID' to match your DB schema
      const token = jwt.sign(userPayload, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      // If the password doesn't match, respond with an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

//Connecting to backend, port number 8000
app.listen(8000, ()=>{
    console.log("Connected to backend!")
})
/*
// index.js
import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

// Connecting to the database
const db = mysql.createConnection({
  host: "localhost", // change if needed
  user: "root",      // change if needed
  password: "GermanVoronovich",//change to your password // change to your password
  database: "e_bidding_system"
});

// If there is an auth problem
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword';

app.use(express.json());
app.use(cors());

// Test GET method
app.get("/", (req, res) => {
  res.json("Hello, this is the backend!");
});

// Generate arithmetic question
app.get('/generate-question', (req, res) => {
  const operators = ['+', '-', '*'];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  res.json({ num1, num2, operator });
});

// Registration route
app.post("/users", async (req, res) => {
  const { username, password, email, userAnswer, correctAnswer } = req.body;

  // Validate arithmetic question
  if (parseInt(userAnswer) !== parseInt(correctAnswer)) {
    return res.status(400).json({ message: 'Incorrect arithmetic answer.' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, 'Visitor', 0, 0, 0, 0, 0, 0, 1, NOW())";

    const values = [
      username,
      hashedPassword,
      email
    ];

    // Execute the query
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: 'Registration successful' });
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

// Route to get user data
app.get('/user-data', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch user information from the database
  const userQuery = "SELECT * FROM user WHERE UserID = ?";
  const itemsQuery = "SELECT * FROM item WHERE OwnerID = ?";//items

  db.query(userQuery, [userId], (err, userData) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (userData.length === 0) return res.status(404).json({ message: 'User not found' });

    db.query(itemsQuery, [userId], (err, itemsData) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.json({
        user: userData[0],
        items: itemsData,
      });
    });
  });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Query to find the user by username
  const query = "SELECT * FROM user WHERE Username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      // If no user is found, respond with an error
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Fetch the user from the result
    const user = result[0];

    // Check if the provided password matches the password from the database
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (passwordMatch) {
      // If password matches, generate a JWT token
      const userPayload = { id: user.UserID, role: user.Role }; // Adjust 'UserID' to match your DB schema
      const token = jwt.sign(userPayload, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      // If the password doesn't match, respond with an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Start the server
app.listen(8000, () => {
  console.log("Connected to backend!");
});

*/