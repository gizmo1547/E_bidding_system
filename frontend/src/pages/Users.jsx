import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const Users = () => {
  const [users,setUsers] = useState([])


  useEffect(()=>{
    const fecthAllUsers = async ()=>{
     try
     {
      const res = await axios.get("http://localhost:8000/users");
      console.log(res.data);
      setUsers(res.data);
      //console.log(res);
     }catch(err)
     {
      console.log(err);
     }
    };
    fecthAllUsers()
  },[]);

   
    /*
    (
    <div>
        <h1>User List</h1>
        <div className="users">
          {users.map((user) => (
            <div className="user" key={user.UserID}>
              <h3>{user.username}</h3>
              <p><strong>Email:</strong> {user.Email}</p>
              <p><strong>Account Balance:</strong> ${user.AccountBalance}</p>
              <p><strong>Is VIP:</strong> {user.IsVIP ? 'Yes' : 'No'}</p>
              <p><strong>Average Rating:</strong> {user.AverageRating}</p>
              <p><strong>Number of Transactions:</strong> {user.NumberOfTransactions}</p>
              <p><strong>Suspension Count:</strong> {user.SuspensionCount}</p>
              <p><strong>Is Active:</strong> {user.IsActive ? 'Yes' : 'No'}</p>
              <p><strong>Registration Date:</strong> {new Date(user.RegistrationDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
    
  */

  return  (
    <div>
      <h1>User List</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account Balance</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Is VIP</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Average Rating</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Number of Transactions</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Is Active</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.UserID}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.Username}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.Email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>${user.AccountBalance}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.IsVIP ? 'Yes' : 'No'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.AverageRating}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.NumberOfTransactions}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.IsActive ? 'Yes' : 'No'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(user.RegistrationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Users