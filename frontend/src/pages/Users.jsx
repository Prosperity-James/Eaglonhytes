import React, { useEffect, useState } from 'react';
import '../styles/users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost/Zinq%20Bridge%20Apartments/api/users.php?action=list', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.items);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError('Error fetching users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  return (
    <div className="container users-page">
      <h2 className="section-title">User Management</h2>
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Active</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.is_admin ? 'Yes' : 'No'}</td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-users">No users found.</p>
      )}
    </div>
  );
}
