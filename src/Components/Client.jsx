import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import API from "../Components/Process";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    CompanyID: "",
    ClientName: "",
    ClientCode: "",
    Username: "",
    PhoneNo: "",
    Email: "",
    Address: "",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [clientRes, companyRes] = await Promise.all([
  //         axios.get(`${API}Client/getClient`),
  //         axios.get(`${API}Company/getCompany`),
  //       ]);
  //       setClients(clientRes.data.data);
  //       setCompanies(companyRes.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, companyRes, userRes] = await Promise.all([
          axios.get(`${API}Client/getClient`),
          axios.get(`${API}Company/getCompany`),
          axios.get(`${API}User/getUser`), // Fetch users from API
        ]);
        setClients(clientRes.data.data);
        setCompanies(companyRes.data.data);
        setUsers(userRes.data.data); // Store fetched users
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = { ...formData };
      await axios.post(`${API}Client/setClient`, requestData);

      Swal.fire(
        "Success",
        requestData.ClientID
          ? "Client updated successfully!"
          : "Client added successfully!",
        "success"
      );

      setShowModal(false);
      setFormData({
        CompanyID: "",
        ClientName: "",
        ClientCode: "",
        Username: "",
        PhoneNo: "",
        Email: "",
        Address: "",
        ClientID: "",
      });

      // Refresh client list
      const response = await axios.get(`${API}Client/getClient`);
      setClients(response.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to save client", "error");
      console.error("Error saving client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      ClientID: client.ClientID,
      CompanyID: client.CompanyID,
      ClientName: client.ClientName,
      ClientCode: client.ClientCode,
      Username: client.Username,
      PhoneNo: client.PhoneNo,
      Email: client.Email,
      Address: client.Address,
    });
    setShowModal(true);
  };

  const handleDelete = async (clientID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API}Client/removeClient`, { ClientID: clientID });

          Swal.fire("Deleted!", "Client has been deleted.", "success");

          // Update client list
          setClients(clients.filter((client) => client.ClientID !== clientID));
        } catch (error) {
          Swal.fire("Error", "Failed to delete client", "error");
          console.error("Error deleting client:", error);
        }
      }
    });
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
                    <th className="border p-2">Company Name</th>
                    <th className="border p-2">Client Name</th>
                    <th className="border p-2">Client Code</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Phone No</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.ClientID} className="text-center">
                      <td className="border p-2">{client.ClientID}</td>
                      <td className="border p-2">{client.CompanyName}</td>
                      <td className="border p-2">{client.ClientName}</td>
                      <td className="border p-2">{client.ClientCode}</td>
                      <td className="border p-2">{client.Username}</td>
                      <td className="border p-2">{client.PhoneNo}</td>
                      <td className="border p-2">{client.Email}</td>
                      <td className="border p-2">{client.Address}</td>
                      <td className="border p-2">{client.CreatedAt}</td>
                      <td className="border p-2 space-x-3 text-lg">
                        <span
                          onClick={() => handleEdit(client)}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                          title="Edit"
                        >
                          ✏️
                        </span>
                        <span
                          onClick={() => handleDelete(client.ClientID)}
                          className="text-red-500 cursor-pointer hover:text-red-600"
                          title="Delete"
                        >
                          🗑️
                        </span>
                      </td>
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {formData.ClientID ? "Update Client" : "Add Client"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ClientName" className="block font-medium">
                  Client Name
                </label>
                <input
                  type="text"
                  id="ClientName"
                  name="ClientName"
                  placeholder="Enter Client Name"
                  value={formData.ClientName}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
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
                  placeholder="Enter Client Code"
                  value={formData.ClientCode}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Show Username input only when adding a client */}
              {!formData.ClientID && (
                <div>
                  <label htmlFor="Username" className="block font-medium">
                    Enter Username
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
              )}

              <div>
                <label htmlFor="PhoneNo" className="block font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="PhoneNo"
                  placeholder="Phone No"
                  value={formData.PhoneNo}
                  onChange={(e) => {
                    if (/^\d{0,10}$/.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  className="w-full border p-2 rounded"
                  required
                  maxLength="10"
                  pattern="^\d{10}$"
                  title="Phone number must be exactly 10 digits and contain only numbers"
                />
                <small className="text-red-500">
                  {formData.PhoneNo &&
                    !/^\d{10}$/.test(formData.PhoneNo) &&
                    "Phone number must be exactly 10 digits."}
                </small>
              </div>

              <div>
                <label htmlFor="Email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="Enter Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="Address" className="block font-medium">
                  Address
                </label>
                <textarea
                  id="Address"
                  name="Address"
                  placeholder="Enter Address"
                  value={formData.Address}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      CompanyID: "",
                      ClientName: "",
                      PhoneNo: "",
                      Email: "",
                      Address: "",
                      ClientID: "",
                    }); // Reset on cancel
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : formData.ClientID
                    ? "Update Client"
                    : "Add Client"}
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
