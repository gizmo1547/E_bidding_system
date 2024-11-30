// Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchItems();
    fetchComplaints();
    fetchApplications();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSuspendUser = async (userId, action) => {
    try {
      await axios.put(
        `http://localhost:8000/admin/users/${userId}/suspend`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.put(
        `http://localhost:8000/admin/items/${itemId}/remove`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await axios.put(
        `http://localhost:8000/admin/complaints/${complaintId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      await axios.put(
        `http://localhost:8000/admin/applications/${applicationId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('users')}>Users</button>
        <button onClick={() => setActiveTab('items')}>Items</button>
        <button onClick={() => setActiveTab('complaints')}>Complaints</button>
        <button onClick={() => setActiveTab('applications')}>Applications</button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User Management</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Is Active</th>
                <th>Is Suspended</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UserID}>
                  <td>{user.Username}</td>
                  <td>{user.Email}</td>
                  <td>{user.IsActive ? 'Yes' : 'No'}</td>
                  <td>{user.IsSuspended ? 'Yes' : 'No'}</td>
                  <td>
                    {user.IsSuspended ? (
                      <button onClick={() => handleSuspendUser(user.UserID, 'activate')}>
                        Activate
                      </button>
                    ) : (
                      <button onClick={() => handleSuspendUser(user.UserID, 'suspend')}>
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="items-section">
          <h2>Item Management</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>OwnerID</th>
                <th>Status</th>
                <th>Is Removed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.ItemID}>
                  <td>{item.Title}</td>
                  <td>{item.OwnerID}</td>
                  <td>{item.Status}</td>
                  <td>{item.IsRemoved ? 'Yes' : 'No'}</td>
                  <td>
                    {!item.IsRemoved && (
                      <button onClick={() => handleRemoveItem(item.ItemID)}>Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="complaints-section">
          <h2>Complaints</h2>
          <table>
            <thead>
              <tr>
                <th>Complainant</th>
                <th>Against User</th>
                <th>Content</th>
                <th>Complaint Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.ComplaintID}>
                  <td>{complaint.Complainant}</td>
                  <td>{complaint.AgainstUser}</td>
                  <td>{complaint.Content}</td>
                  <td>{new Date(complaint.ComplaintDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleResolveComplaint(complaint.ComplaintID)}>
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="applications-section">
          <h2>User Applications</h2>
          <table>
            <thead>
              <tr>
                <th>Visitor Username</th>
                <th>Arithmetic Question</th>
                <th>Provided Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.ApplicationID}>
                  <td>{app.VisitorUsername}</td>
                  <td>{app.ArithmeticQuestion}</td>
                  <td>{app.ProvidedAnswer}</td>
                  <td>
                    <button onClick={() => handleApproveApplication(app.ApplicationID)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;




