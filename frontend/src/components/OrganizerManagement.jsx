import { useEffect, useState } from "react";
import axios from "axios";

const OrganizerManagement = () => {
  const [organizers, setOrganizers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/organizers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setOrganizers(data);
    } catch (error) {
      console.error("Error fetching organizers", error);
    }
  };

  const handleBlockUnblock = async (organizerId) => {
    try {
        console.log("blocking");
        
      await axios.put(
        `http://localhost:5000/api/organizers/${organizerId}/toggle-block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      fetchOrganizers();
    } catch (error) {
      console.error("Error updating organizer status", error);
    }
  };

  const handleDeleteOrganizer = async (organizerId) => {
    if (!window.confirm("Are you sure you want to delete this organizer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/organizers/${organizerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      fetchOrganizers();
    } catch (error) {
      console.error("Error deleting organizer", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Organizer Management</h2>
      <input
        type="text"
        placeholder="Search Organizers"
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
              {organizers
                .filter((org) =>
                  org.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((org) => (
                  <tr key={org._id} className="border-b">
                    <td className="p-2 break-words">{org.name}</td>
                    <td className="p-2 break-words">{org.email}</td>
                    <td className="p-2 text-center">
                      {org.isBlocked ? (
                        <span className="text-red-500">Blocked</span>
                      ) : (
                        <span className="text-green-500">Active</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                        <button
                          className={`px-4 py-2 text-white rounded-lg w-full md:w-auto ${org.isBlocked ? "bg-green-500" : "bg-red-500"
                            }`}
                          onClick={() => handleBlockUnblock(org._id)}
                        >
                          {org.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg w-full md:w-auto"
                          onClick={() => handleDeleteOrganizer(org._id)}
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

export default OrganizerManagement;
