import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../Components/Process";
import Header from "../Components/Header"; // Importing Header

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API}User/getUser`);
        console.log("API Response:", response.data); // Debugging Step 1

        if (response.data && Array.isArray(response.data.data)) {
          // If data is an array, count its length
          setTotalUsers(response.data.data.length);
        } else if (response.data.count) {
          // If API directly returns a count
          setTotalUsers(response.data.count);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching total users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header /> {/* Using Header component */}

      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

        {isLoading ? (
          <div className="text-center text-lg">Loading total users...</div>
        ) : (
          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-medium">Total Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
