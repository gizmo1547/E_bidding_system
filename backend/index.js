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


/*
  const q = `
    UPDATE Application SET IsApproved = TRUE, ApprovedBy = ?, ApprovalDate = NOW()
    WHERE ApplicationID = ?
  `;

  db.query(q, [approvedBy, applicationId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Application approved successfully' });
  });
});
*/
const q = `
  UPDATE Application SET IsApproved = TRUE, ApprovedBy = ?, ApprovalDate = NOW()
  WHERE ApplicationID = ?
`;

db.query(q, [approvedBy, applicationId], (err, result) => {
  if (err) return res.status(500).json(err);

  const q2 = `SELECT VisitorID FROM Application WHERE ApplicationID = ?`;
  db.query(q2, [applicationId], (err2, data) => {
    if (err2) return res.status(500).json(err2);
    if (data.length === 0) return res.status(404).json({ message: 'Application not found' });

    const visitorID = data[0].VisitorID;

    const q3 = `UPDATE User SET Role='User', IsActive=1 WHERE UserID = ?`;
    db.query(q3, [visitorID], (err3) => {
      if (err3) return res.status(500).json(err3);
      return res.json({ message: 'Application approved and user activated successfully.' });
    });
  });
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

  const q = `
    INSERT INTO user 
    (Username, Password, Email, Role, AccountBalance, IsVIP, IsSuspended, SuspensionCount, AverageRating, NumberOfTransactions, IsActive, RegistrationDate)
    VALUES (?, ?, ?, 'Visitor', 0, 0, 0, 0, 0, 0, 0, NOW());
  `;

  const values = [username, hashedPassword, email];

  // Execute the user insert query
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);

    // Now we have a new user (Visitor). Let's create an Application for them
    const visitorId = data.insertId; // This is the newly created user's ID

    const applicationQuery = `
      INSERT INTO Application 
      (VisitorID, ArithmeticQuestion, ProvidedAnswer, IsHumanVerified, IsApproved, ApplicationDate)
      VALUES (?, 'Some question', ?, false, false, NOW())
    `;

    // Insert the Application record
    db.query(applicationQuery, [visitorId, userAnswer], (appErr, appData) => {
      if (appErr) return res.status(500).json(appErr);
      return res.json({ message: 'Registration successful. Waiting for admin approval.' });
    });
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


/*
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
*/

// Login route Abubacar
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Query to find the user by username
  const query = "SELECT * FROM user WHERE Username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (passwordMatch) {
      // If password matches, generate a JWT token
      const userPayload = { id: user.UserID, role: user.Role }; // Adjust 'UserID' to match your DB schema
      const token = jwt.sign(userPayload, 'your_jwt_secret', { expiresIn: '1h' });

      // Respond with the token, userID, and role
      res.json({
        message: 'Login successful',
        token,
        role: user.Role,
        userID: user.UserID, // Add userID here
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
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

//Update address
app.post('/update-address', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, address, zip, city, state, country, phoneNumber } = req.body;

  const q = "UPDATE user SET FirstName = ?, Lastname = ?, Address = ?, ZipCode = ?, City = ?, State = ?, Country = ?, PhoneNumber = ? WHERE UserID = ?";

  db.query(q, [firstName, lastName, address, zip, city, state, country, phoneNumber, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    return res.json({ message: 'Email updated successfully' });
  });
});

/*
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
*/

// Add Money route
app.post('/add-money', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { amountDeposit } = req.body;

  // Validate amount
  if (amountDeposit <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  // Update user's account balance
  const q = "UPDATE user SET AccountBalance = AccountBalance + ? WHERE UserID = ?";

  db.query(q, [amountDeposit, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    return res.json({ message: 'Account balance updated successfully' });
  });
});

//Withdraw 
app.post('/withdraw-money', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { amountWithdrawn } = req.body;

  // Validate amount
  if (amountWithdrawn <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  // Update user's account balance
  const q = "UPDATE user SET AccountBalance = AccountBalance - ? WHERE UserID = ?";

  db.query(q, [amountWithdrawn, userId], (err, result) => {
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

// Route to create a new item (sell an item)
app.post('/items', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { title, description, askingPrice, listingType, deadline, image_url, categoryName } = req.body;

  // Validate required fields
  if (!title || !askingPrice || !listingType || !deadline || !categoryName) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // ListingType validation (optional)
  const allowedTypes = ['ForSale', 'ForRent', 'Wanted'];
  if (!allowedTypes.includes(listingType)) {
    return res.status(400).json({ message: 'Invalid listing type.' });
  }

  // Deadline should be in the future (optional check)
  const now = new Date();
  const deadlineDate = new Date(deadline);
  if (deadlineDate <= now) {
    return res.status(400).json({ message: 'Deadline must be in the future.' });
  }

  // First, find the CategoryID from the categoryName
  const categoryQuery = "SELECT CategoryID FROM Categories WHERE CategoryName = ?";
  db.query(categoryQuery, [categoryName], (catErr, catData) => {
    if (catErr) return res.status(500).json({ message: 'Database error', error: catErr });

    if (catData.length === 0) {
      // If category not found, return error
      return res.status(400).json({ message: 'Category not found.' });
    }

    const categoryId = catData[0].CategoryID;

    // Insert the new item
    //We can make timer here
    const insertQuery = `
    INSERT INTO Item (OwnerID, Title, Description, AskingPrice, ListingType, Deadline, image_url, CategoryID)
    VALUES (?, ?, ?, ?, ?, NOW() + INTERVAL 7 DAY, ?, ?)
  `;
  
  db.query(insertQuery, [userId, title, description || '', askingPrice, listingType, image_url || '', categoryId], (insertErr, insertResult) => {
    if (insertErr) {
      console.error(insertErr);
      return res.status(500).json({ message: 'Database error', error: insertErr });
    }
  
    return res.json({ message: 'Item created successfully with 1-minute deadline', itemId: insertResult.insertId });
  });
  
  });
});


/*
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
*/

app.get('/items-with-highest-bids', (req, res) => {
  // Get category ID from query params
  const categoryID = req.query.categoryID;

  // Base query
  let query = `
    SELECT 
      i.*, 
      (SELECT MAX(b.BidAmount) 
       FROM Bid b 
       WHERE b.ItemID = i.ItemID AND b.sAccepted = 0) AS highest_bid
    FROM Item i
    WHERE i.IsRemoved = 0
  `;
  
  // If a category ID is provided, filter by it
  if (categoryID) {
    query += ` AND i.CategoryID = ?`;
  }

  // Execute query with category ID if provided
  db.query(query, categoryID ? [categoryID] : [], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// bot endpoint
// Improved bot endpoint with dynamic responses and personalization
app.post('/bot', authenticateToken, async (req, res) => {
  const userMessage = req.body.message.trim().toLowerCase();
  
  // Helper function to fetch categories from the DB
  const getCategoriesFromDB = () => {
    return new Promise((resolve, reject) => {
      const q = "SELECT CategoryName FROM Categories";
      db.query(q, (err, data) => {
        if (err) return reject(err);
        const categoryNames = data.map(row => row.CategoryName);
        resolve(categoryNames);
      });
    });
  };

  // Helper function to fetch user balance if logged in
  const getUserBalance = (userId) => {
    return new Promise((resolve, reject) => {
      const q = "SELECT AccountBalance FROM user WHERE UserID = ?";
      db.query(q, [userId], (err, data) => {
        if (err) return reject(err);
        if (data.length === 0) return resolve(null);
        resolve(data[0].AccountBalance);
      });
    });
  };

  // Helper function to fetch items by category
  const getItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
      const q = "SELECT Title, AskingPrice FROM item WHERE Category = ? AND IsRemoved = 0 LIMIT 5";
      db.query(q, [category], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  let reply = "I’m here to assist you. Try asking for help to see what I can do.";

  try {
    // Handle help command
    if (userMessage.includes("help")) {
      reply = `
I can help you with:

- "Show me categories"
- "Show me items in [category]"
- "What's my balance?"
- "help" to see this message again
      `.trim();
    }

    // Handle categories command
    else if (userMessage.includes("categories")) {
      const categories = await getCategoriesFromDB();
      if (categories.length > 0) {
        reply = "Our available categories are: " + categories.join(", ");
      } else {
        reply = "No categories found at the moment.";
      }
    }

    // Handle balance command (requires authenticated user)
    else if (userMessage.includes("balance")) {
      if (req.user && req.user.id) {
        const balance = await getUserBalance(req.user.id);
        if (balance !== null) {
          reply = `Your current balance is $${balance.toFixed(2)}`;
        } else {
          reply = "I couldn’t find your balance. Please make sure you’re logged in.";
        }
      } else {
        reply = "Please log in to view your balance.";
      }
    }

    // Handle items by category: "items in electronics"
    else if (userMessage.includes("items in")) {
      const words = userMessage.split(" ");
      const categoryIndex = words.indexOf("in") + 1;
      if (categoryIndex > 0 && categoryIndex < words.length) {
        const categoryName = words.slice(categoryIndex).join(" ");
        const items = await getItemsByCategory(categoryName);
        if (items.length > 0) {
          reply = `Top items in ${categoryName}:\n` + items.map(i => `${i.Title} - $${i.AskingPrice.toFixed(2)}`).join("\n");
        } else {
          reply = `No items found in category: ${categoryName}.`;
        }
      } else {
        reply = "Please specify a category, e.g. 'items in electronics'.";
      }
    }
    
    // Default response if none of the conditions match
    else {
      reply = "I’m here to help! Try asking for 'help' to see what I can do.";
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Error in bot endpoint:", error);
    return res.status(500).json({ reply: "Oops! Something went wrong on my end." });
  }
});


// Fetch comments for an item
app.get('/comments/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  const q = `
    SELECT 
      Comment.CommentID,
      Comment.UserID,
      CASE 
        WHEN Comment.UserID IS NOT NULL THEN User.Username 
        ELSE 'User' 
      END AS Username, -- Display 'User' for visitors
      Comment.VisitorName,
      Comment.Content,
      Comment.CommentDate
    FROM Comment
    LEFT JOIN User ON Comment.UserID = User.UserID -- Join with User table
    WHERE Comment.ItemID = ?
    ORDER BY Comment.CommentDate DESC
  `;

  db.query(q, [itemId], (err, data) => {
    if (err) return res.status(500).json({ error: err });
    return res.json(data);
  });
});



// Post a comment
app.post('/comments', (req, res) => {
  const { itemId, content, visitorName } = req.body;

  // Check if a user is logged in by checking the token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Default values for the insert
  let userId = null;

  if (token) {
    // Verify token
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        // Token invalid, treat as visitor
        userId = null;
      } else {
        // Logged in user
        userId = user.id;
      }
      insertComment();
    });
  } else {
    // No token, must provide visitorName
    if (!visitorName || !content) {
      return res.status(400).json({message: 'Visitor name and content are required for visitors.'});
    }
    insertComment();
  }

  function insertComment() {
    const q = `
      INSERT INTO Comment (UserID, VisitorName, ItemID, Content, CommentDate)
      VALUES (?, ?, ?, ?, NOW())
    `;
    db.query(q, [userId, visitorName || null, itemId, content], (err, result) => {
      if (err) return res.status(500).json({error: err});
      return res.json({message: 'Comment added successfully!'});
    });
  }
});


/*
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

*/
// Endpoint to place a bid
/*
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
*/
/*
// Place a bid route (without token authentication)
app.post('/api/placebid', (req, res) => {
  const { itemID, bidAmount, bidderID } = req.body;

  // Step 1: Check if the bidder exists in the User table
  const checkUserQuery = "SELECT * FROM User WHERE UserID = ?";
  db.query(checkUserQuery, [bidderID], (err, userResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error during user check.', error: err });
    }

    if (userResult.length === 0) {
      return res.status(400).json({ message: 'Bidder does not exist.' });
    }

    // Step 2: If the bidder exists, insert the bid into the Bid table
    const insertBidQuery = `
      INSERT INTO Bid (ItemID, BidAmount, BidDate, BidderID) 
      VALUES (?, ?, NOW(), ?)
    `;
    db.query(insertBidQuery, [itemID, bidAmount, bidderID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to place bid', error: err });
      }
      res.json({ message: 'Bid placed successfully!' });
    });
  });
});
*/
app.post('/api/placebid', (req, res) => {
  const { itemID, bidAmount, bidderID } = req.body;

  // Step 1: Check if the bidder exists and is approved in the User table
  const checkUserQuery = "SELECT Role, IsActive FROM User WHERE UserID = ?";
  db.query(checkUserQuery, [bidderID], (err, userResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error during user check.', error: err });
    }

    if (userResult.length === 0) {
      return res.status(400).json({ message: 'Bidder does not exist.' });
    }

    const { Role, IsActive } = userResult[0];

    // Check if user is approved (Role='User' and IsActive=1)
    if (Role !== 'User' || IsActive !== 1) {
      return res.status(403).json({ message: 'You are not approved to place bids yet.' });
    }

    // Step 2: If the bidder is approved, insert the bid into the Bid table
    const insertBidQuery = `
      INSERT INTO Bid (ItemID, BidAmount, BidDate, BidderID)
      VALUES (?, ?, NOW(), ?)
    `;

    db.query(insertBidQuery, [itemID, bidAmount, bidderID], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to place bid', error: err });
      }
      return res.json({ message: 'Bid placed successfully!' });
    });
  });
});


/*
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
*/
app.get('/api/getHighestBid/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  
  // Get the highest bid for the item
  const highestBidQuery = "SELECT MAX(BidAmount) AS highestBid FROM Bid WHERE ItemID = ?";
  db.query(highestBidQuery, [itemID], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error during bid retrieval', error: err });
    }
    const highestBid = result[0]?.highestBid || 0;
    res.json({ highestBid });
  });
});


app.get('/item/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  // Query to get the item details
  const itemQuery = "SELECT * FROM item WHERE ItemID = ? AND IsRemoved = 0";

  db.query(itemQuery, [itemId], (err, itemData) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (itemData.length === 0) return res.status(404).json({ message: 'Item not found or removed.' });

    const item = itemData[0]; // The fetched item

    // Query to get all bids for the item
    const bidsQuery = `
      SELECT 
        Bid.BidID, 
        Bid.ItemID, 
        Bid.BidAmount, 
        Bid.BidDate, 
        User.Username AS BidderName
      FROM Bid
      INNER JOIN User ON Bid.BidderID = User.UserID
      WHERE Bid.ItemID = ?
      ORDER BY Bid.BidDate DESC
    `;

    db.query(bidsQuery, [itemId], (err, bidsData) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      // Now we have both `item` and `bidsData`
      const now = new Date();
      const deadline = new Date(item.Deadline);

      if (now > deadline) {
        // Bidding ended
        // Determine highest bid
        let highestBid = null;
        let highestBidder = null;
        for (let bid of bidsData) {
          if (!highestBid || bid.BidAmount > highestBid) {
            highestBid = bid.BidAmount;
            highestBidder = bid.BidderName;
          }
        }

        // Update item status to 'Sold'
        const updateQuery = `UPDATE Item SET Status='Sold' WHERE ItemID = ?`;
        db.query(updateQuery, [itemId], (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ message: 'Database error updating item status', error: updateErr });
          }

          item.Status = 'Sold'; // reflect the change locally
          return res.json({
            item: item,
            bids: bidsData,
            message: highestBid 
              ? `Bidding ended. ${highestBidder} won with a bid of $${highestBid}.`
              : 'Bidding ended with no bids.'
          });
        });
      } else {
        // Bidding still open
        return res.json({
          item: item,
          bids: bidsData
        });
      }


    });
  });
});


//Connecting to backend, port number 8000
app.listen(8000, ()=>{
    console.log("Connected to backend!")
})
    
