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

//Test get method
app.get("/", (req,res)=>{
    res.json("hello this is the backend from here to there:)")
})

//User table from mySQL
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
//Port number 8000
app.listen(8000, ()=>{
    console.log("Connected to backend!")
})