import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import API from "../Components/Process";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState([]); // Store client list
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    CompanyName: "",
    Address: "",
    PhoneNo: "",
    Email: "",
    ClientID: "", // Store selected client
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API}Company/getCompany`);
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch clients when modal opens
  useEffect(() => {
    if (showModal) {
      const fetchClients = async () => {
        try {
          const response = await axios.get(`${API}Client/getClient`);
          setClients(response.data.data);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };
      fetchClients();
    }
  }, [showModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleEdit = (company) => {
    setFormData({
      CompanyID: company.CompanyID,
      CompanyName: company.CompanyName,
      Address: company.Address,
      PhoneNo: company.PhoneNo,
      Email: company.Email,
      ClientID: company.ClientID,
    });
    setShowModal(true);
  };
  const handleDelete = async (companyID) => {
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
          await axios.post(`${API}Company/removeCompany`, { CompanyID: companyID });
  
          Swal.fire("Deleted!", "Company has been deleted.", "success");
  
          // Update company list
          setCompanies(companies.filter((company) => company.CompanyID !== companyID));
        } catch (error) {
          Swal.fire("Error", "Failed to delete company", "error");
          console.error("Error deleting company:", error);
        }
      }
    });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API}Company/setCompany`, formData);
      if (formData.CompanyID) {
        Swal.fire("Success", "Company Updated Successfully!", "success");
      } else {
        Swal.fire("Success", "Company Added Successfully!", "success");
      }
      setShowModal(false);
      setFormData({
        CompanyName: "",
        Address: "",
        PhoneNo: "",
        Email: "",
        ClientID: "",
      });

      setIsLoading(true);
      const response = await axios.get(`${API}Company/getCompany`);
      setCompanies(response.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to add company", "error");
      console.error("Error adding company:", error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Company List</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Company
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            <p className="ml-3 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            {companies.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Company ID</th>
                    <th className="border p-2">Company Name</th>
                    <th className="border p-2">Client Name</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Phone No</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Operations</th>{" "}
                    {/* New column */}
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.CompanyID} className="text-center">
                      <td className="border p-2">{company.CompanyID}</td>
                      <td className="border p-2">{company.CompanyName}</td>
                      <td className="border p-2">
                        {company.ClientName || "N/A"}
                      </td>
                      <td className="border p-2">{company.Address}</td>
                      <td className="border p-2">{company.PhoneNo}</td>
                      <td className="border p-2">{company.Email}</td>
                      <td className="border p-2">{company.CreatedAt}</td>
                      <td className="border p-2 space-x-3 text-lg">
                        <span
                          onClick={() => handleEdit(company)}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                          title="Edit"
                        >
                          ✏️
                        </span>
                        <span
                          onClick={() => handleDelete(company.CompanyID)}
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
              <p className="text-center text-gray-500 mt-4">
                No companies found
              </p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4"> {formData.CompanyID ? "Update Company" : "Add Company"}</h2>
            {/* Form Starts Here */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block font-semibold">Client</label>
                <select
                  name="ClientID"
                  value={formData.ClientID}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.ClientID} value={client.ClientID}>
                      {client.ClientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold">Company Name</label>
                <input
                  type="text"
                  name="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Phone No</label>
                <input
                  type="text"
                  name="PhoneNo"
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
                <label className="block font-semibold">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Enter a valid email address."
                  required
                />
                <small className="text-red-500">
                  {formData.Email &&
                    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      formData.Email
                    ) &&
                    "Enter a valid email address."}
                </small>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      CompanyID: "",
                      CompanyName: "",
                      Address: "",
                      PhoneNo: "",
                      Email: "",
                      ClientID: "",
                    }); // Reset form on cancel
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
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
                    : formData.CompanyID
                      ? "Update Company"
                      : "Add Company"}
                </button>
              </div>
            </form>
            {/* Form Ends Here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
