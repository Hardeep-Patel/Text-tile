import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import API from "../Components/Process";
import Swal from "sweetalert2";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    Username: "",
    ClientCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}User/userLogin`, formData);

      if (response.data.success) {
        Cookies.set("Username", formData.Username);
        Cookies.set("ClientID", response.data.clientID);

        Swal.fire("Success", "Login successful!", "success");
        navigate("/user-dashboard");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Invalid Username or Client Code", "error");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="Username" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter Username"
            />
          </div>

          <div>
            <label htmlFor="ClientCode" className="block font-medium">
              Client Code
            </label>
            <input
              type="text"
              id="ClientCode"
              name="ClientCode"
              value={formData.ClientCode}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter Client Code"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
 