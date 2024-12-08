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
//superUser verify
const verifySuperUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify token and extract user info (assuming JWT is used)
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    if (decoded.role !== 'SuperUser') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
};
//superUser 
app.get('/admin/users', verifySuperUser, (req, res) => {
  const q = `
    SELECT UserID, Username, Email, Role, IsActive, IsSuspended, SuspensionCount, RegistrationDate
    FROM User
    WHERE Role != 'SuperUser'
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
//Suspended
app.put('/admin/users/:id/suspend', verifySuperUser, (req, res) => {
  const userId = req.params.id;
  const { action } = req.body; // 'suspend' or 'activate'

  let q;
  if (action === 'suspend') {
    q = `
      UPDATE User SET IsSuspended = TRUE, SuspensionCount = SuspensionCount + 1
      WHERE UserID = ?
    `;
  } else if (action === 'activate') {
    q = `
      UPDATE User SET IsSuspended = FALSE
      WHERE UserID = ?
    `;
  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }

  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User updated successfully' });
  });
});



//Items super user
app.get('/admin/items', verifySuperUser, (req, res) => {
  const q = `
    SELECT ItemID, Title, Description, AskingPrice, ListingType, Status, ListingDate, Deadline, IsRemoved
    FROM Item
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

//Superuser remove
app.put('/admin/items/:id/remove', verifySuperUser, (req, res) => {
  const itemId = req.params.id;

  const q = `
    UPDATE Item SET IsRemoved = TRUE
    WHERE ItemID = ?
  `;

  db.query(q, [itemId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Item removed successfully' });
  });
});
//super user complaints
app.get('/admin/complaints', verifySuperUser, (req, res) => {
  const q = `
    SELECT c.ComplaintID, c.Content, c.ComplaintDate, c.IsResolved, u.Username AS Complainant, a.Username AS AgainstUser
    FROM Complaint c
    JOIN User u ON c.ComplainantID = u.UserID
    JOIN User a ON c.AgainstUserID = a.UserID
    WHERE c.IsResolved = FALSE
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
//rsolve complaints
app.put('/admin/complaints/:id/resolve', verifySuperUser, (req, res) => {
  const complaintId = req.params.id;
  const resolvedBy = req.user.UserID; // Assuming req.user is set by verifySuperUser

  const q = `
    UPDATE Complaint SET IsResolved = TRUE, ResolvedBy = ?, ResolutionDate = NOW()
    WHERE ComplaintID = ?
  `;

  db.query(q, [resolvedBy, complaintId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Complaint resolved successfully' });
  });
});


//Applications
app.get('/admin/applications', verifySuperUser, (req, res) => {
  const q = `
    SELECT a.ApplicationID, a.ArithmeticQuestion, a.ProvidedAnswer, a.IsApproved, u.Username AS VisitorUsername
    FROM Application a
    JOIN User u ON a.VisitorID = u.UserID
    WHERE a.IsApproved = FALSE
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

//Approved
app.put('/admin/applications/:id/approve', verifySuperUser, (req, res) => {
  const applicationId = req.params.id;
  const approvedBy = req.user.UserID;

  const q = `
    UPDATE Application SET IsApproved = TRUE, ApprovedBy = ?, ApprovalDate = NOW()
    WHERE ApplicationID = ?
  `;

  db.query(q, [approvedBy, applicationId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Application approved successfully' });
  });
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

  const q = "INSERT INTO user (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate) VALUES (?, ?, ?, 'User', 0, 0, 0, 0, 0, 0, 1, NOW())";

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
      res.json({ message: 'Login successful', token, role: user.Role });
    } else {
      // If the password doesn't match, respond with an error
      res.status(401).json({ message: 'Invalid credentials' });//google if you have this error
    }
  });
});

// Update Email route
app.post('/update-email', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { email } = req.body;

  const q = "UPDATE user SET Email = ? WHERE UserID = ?";

  db.query(q, [email, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    return res.json({ message: 'Email updated successfully' });
  });
});


// Add Money route
app.post('/add-money', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  // Validate amount
  if (amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  // Update user's account balance
  const q = "UPDATE user SET AccountBalance = AccountBalance + ? WHERE UserID = ?";

  db.query(q, [amount, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    return res.json({ message: 'Account balance updated successfully' });
  });
});
// Fetch all items (Edison Florian)
app.get("/items", (req, res) => {
  const q = "SELECT Title,Description,AskingPrice FROM item";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    return res.json(data);
  });
});

//Categores
app.get("/categories", (req, res) => {
  const q = "SELECT CategoryID, CategoryName, CategoryDescription FROM Categories";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    return res.json(data);
  });
});
/*
// Fetch all items (Edison Florian)
app.get("/items", (req, res) => {
  const q = "SELECT Title,imgSrc,Description,AskingPrice FROM item";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    return res.json(data);
  });
});
*/

// Endpoint to get all items with their highest bids
app.get('/items-with-highest-bids', (req, res) => {
  const query = `
    SELECT 
      i.*, 
      (SELECT MAX(b.BidAmount) 
       FROM Bid b 
       WHERE b.ItemID = i.ItemID AND b.sAccepted = 0) AS highest_bid
    FROM Item i
    WHERE i.IsRemoved = 0
  `;
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Simple bot endpoint
app.post('/bot', (req, res) => {
  const userMessage = req.body.message;
  
  // Basic logic: respond differently based on user query
  let reply = "I'm here to help! You asked: " + userMessage;

  // Example: If user mentions "categories"
  if (userMessage.toLowerCase().includes("categories")) {
    reply = "Our categories are: " + ["Electronics", "Books", "Art"].join(", ");
  }

  // If user mentions "help"
  if (userMessage.toLowerCase().includes("help")) {
    reply = "Sure, I can help. Ask me about categories, items, or your account.";
  }

  res.json({ reply });
});


// Endpoint to place a bid
app.post('/bids', (req, res) => {
  const { item_id, bidder, amount, user_id} = req.body;

  // Validate input
  if (!item_id || !bidder || !amount || !user_id) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Prepare the SQL query to insert a new bid
  const query = 'INSERT INTO Bid (ItemID, BidderName, BidAmount) VALUES (?, ?, ?)';

  // Execute the query
  db.query(query, [item_id, bidder, amount], (err, result) => {
    if (err) {
      console.error(err); // Log the error
      return res.status(500).json({ message: 'Error placing bid.' });
    }

    // Return success response with the generated BidID
    res.json({ message: 'Bid placed successfully!', bidId: result.insertId });
  });
});




// Endpoint to get a specific item with all its bids
app.get('/item/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  const itemQuery = "SELECT * FROM item WHERE ItemID = ? AND IsRemoved = 0";

  db.query(itemQuery, [itemId], (err, itemData) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (itemData.length === 0) return res.status(404).json({ message: 'Item not found or removed.' });

    const bidsQuery = "SELECT * FROM Bid WHERE ItemID = ? ORDER BY BidDate DESC";

    db.query(bidsQuery, [itemId], (err, bidsData) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.json({
        item: itemData[0],  // Send the item data
        bids: bidsData,     // Send all bids for the item
      });
    });
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
