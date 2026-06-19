import React,{useState,useEffect} from 'react'
import axios from 'axios';
import "./Admin.scss";
export default function Users() {
  const [users,setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchUsers = async () => {
    try{
      setLoading(true);
      setError("");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/admin/getallusers`
        ,{
          withCredentials:true
        }
      )
      console.log(response.data);
      setUsers(response.data?.users || []);
    }
    catch(err){
      console.error(err.message);
      setError(err.response?.data?.message || err.message || "Failed to load users");
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUsers();
  },[])
  return (
    <div>
      <section className="page1 users-container">
      <div className="admin-assignments__header">
        <div>
          <h1>User Details</h1>
          <p>View and manage all registered SQLStudio users.</p>
        </div>
      </div>
      {loading ? (
        <div className="admin-assignments__panel">
          <p className="admin-assignments__muted">Loading user accounts...</p>
        </div>
      ) : error ? (
        <div className="admin-assignments__panel">
          <p className="admin-assignments__error">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="admin-assignments__panel">
          <p className="admin-assignments__muted">No users found.</p>
        </div>
      ) : (
        <div className="users-panel">
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`user-role-badge user-role-badge--${u.role || 'user'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
    </div>
  )
}
