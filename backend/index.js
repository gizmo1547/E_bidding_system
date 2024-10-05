import express from "express"
import mysql from "mysql"

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

//Test get method
app.get("/", (req,res)=>{
    res.json("hello this is the backend from here to there:)")
})

//Test User table from mySQL
app.get("/user", (req,res)=>{
  const q = "SELECT * FROM user"
db.query(q,(err,data)=>{
    if(err) return res.json(err)
        return res.json(data)
  })
})

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

//Testing post method
app.post("/user", (req, res) => {
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

//Connecting to backend, port number 8000
app.listen(8000, ()=>{
    console.log("Connected to backend!")
})
    