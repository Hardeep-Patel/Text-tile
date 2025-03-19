import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import API from '../Components/Process'

const Client = () => {
  const [clients, setClients] = useState([]); // Store client data
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader for form submission
  const [showModal, setShowModal] = useState(false); // Toggle form visibility
  const [formData, setFormData] = useState({
    CompanyID: "",
    ClientName: "",
    PhoneNo: "",
    Email: "",
    Address: "",
  });

  const token = Cookies.get("UserID"); // Get token from cookies

  // Fetch client data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${API}Client/getClient`
        );
        setClients(response.data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false); // Hide loader when data is loaded
      }
    };
    fetchClients();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show loader in button
    try {
      await axios.post(
        `${API}Client/setClient`,
        formData
      );
      Swal.fire("Success", "Client added successfully!", "success");
      setShowModal(false);
      setFormData({ CompanyID: "", ClientName: "", PhoneNo: "", Email: "", Address: "" });

      // Refresh client list
      setIsLoading(true);
      const response = await axios.get(
        `${API}Client/getClient`
      );
      setClients(response.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to add client", "error");
      console.error("Error adding client:", error);
    } finally {
      setIsSubmitting(false); // Hide loader
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Client List</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Client
          </button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            <p className="ml-3 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            {clients.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Client ID</th>
                    <th className="border p-2">Company ID</th>
                    <th className="border p-2">Client Name</th>
                    <th className="border p-2">Phone No</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.ClientID} className="text-center">
                      <td className="border p-2">{client.ClientID}</td>
                      <td className="border p-2">{client.CompanyID}</td>
                      <td className="border p-2">{client.ClientName}</td>
                      <td className="border p-2">{client.PhoneNo}</td>
                      <td className="border p-2">{client.Email}</td>
                      <td className="border p-2">{client.Address}</td>
                      <td className="border p-2">{client.CreatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-4">No clients found</p>
            )}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Client</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="CompanyID"
                placeholder="Company ID"
                value={formData.CompanyID}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="ClientName"
                placeholder="Client Name"
                value={formData.ClientName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="PhoneNo"
                placeholder="Phone No"
                value={formData.PhoneNo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="Address"
                placeholder="Address"
                value={formData.Address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  )}
                  {isSubmitting ? "Adding..." : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;
