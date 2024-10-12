//index.js
import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcrypt';

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
app.post("/user", (req, res) => {
    const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    const values = [
      "Oleksey",
      "password456",
      "Oleksey@example.com", 
      "User",  // Assuming you meant 'User' for role
      1000.50, // This should be a number, not a string
      false,   // Boolean values, not strings
      false,
      0,       // SuspensionCount
      4.50,    // AverageRating
      10,      // NumberOfTransactions
      true     // IsActive
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
*/
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

app.get('/generate-question', (req, res) => {
  const operators = ['+', '-', '*'];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer;
  switch (operator) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
  }
  
  // Store the correct answer in the session or a temporary store
  // For simplicity, we'll send the question and expect the frontend to send back the answer for verification
  res.json({ num1, num2, operator });
});

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
  




/*
// Login function with real database check
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query to find the user by username
  const query = "SELECT * FROM user WHERE Username = ?";
  
  db.query(query, [username], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      // If no user is found, respond with an error
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Fetch the first (and only) user from the result
    const user = result[0];

    // Check if the provided password matches the password from the database
    if (user.Password === password) {
      // If password matches, respond with a success message (you can also generate a token here)
      res.json({ message: 'Login successful', token: 'fake-jwt-token' });
    } else {
      // If the password doesn't match, respond with an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

*/
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
          // If password matches, respond with a success message
          res.json({ message: 'Login successful', token: 'fake-jwt-token' });
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
    