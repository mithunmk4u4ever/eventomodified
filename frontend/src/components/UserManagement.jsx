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
      const { data } = await axios.get("http://localhost:5000/api/users", {
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
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
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
        <div className="w-full overflow-x-auto">
          <table className="w-full max-w-[100vw] table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left break-words">Name</th>
                <th className="p-2 text-left break-words">Email</th>
                <th className="p-2 text-center break-words">Status</th>
                <th className="p-2 text-center break-words">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2 break-words">{user.name}</td>
                    <td className="p-2 break-words">{user.email}</td>
                    <td className="p-2 text-center">
                      {user.isBlocked ? (
                        <span className="text-red-500">Blocked</span>
                      ) : (
                        <span className="text-green-500">Active</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                        <button
                          className={`px-4 py-2 text-white rounded-lg w-full md:w-auto ${user.isBlocked ? "bg-green-500" : "bg-red-500"
                            }`}
                          onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg w-full md:w-auto"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;
