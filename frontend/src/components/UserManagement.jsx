import { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleBlockUnblock = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/toggle-block`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // ✅ Fixed
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status", error);
    }
};

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <input
        type="text"
        placeholder="Search Users"
        className="w-full p-2 border rounded-lg mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="bg-white p-4 shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 text-center">
                    {user.isBlocked ? (
                      <span className="text-red-500">Blocked</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className={`px-4 py-2 text-white rounded-lg ${
                        user.isBlocked ? "bg-green-500" : "bg-red-500"
                      }`}
                      onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
