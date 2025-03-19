import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import API from '../Components/Process'

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader for form submission
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    CompanyName: "",
    Address: "",
    PhoneNo: "",
    Email: "",
  });

  const token = Cookies.get("UserID");

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API}Company/getCompany`
        );
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show loader in button
    try {
      await axios.post(
        `${API}Company/setCompany`,
        formData
      );
      Swal.fire("Success", "Company added successfully!", "success");
      setShowModal(false);
      setFormData({ CompanyName: "", Address: "", PhoneNo: "", Email: "" });

      setIsLoading(true);
      const response = await axios.get(
        `${API}Company/getCompany`
      );
      setCompanies(response.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to add company", "error");
      console.error("Error adding company:", error);
    } finally {
      setIsSubmitting(false); // Hide loader
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
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Phone No</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.CompanyID} className="text-center">
                      <td className="border p-2">{company.CompanyID}</td>
                      <td className="border p-2">{company.CompanyName}</td>
                      <td className="border p-2">{company.Address}</td>
                      <td className="border p-2">{company.PhoneNo}</td>
                      <td className="border p-2">{company.Email}</td>
                      <td className="border p-2">{company.CreatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-4">No companies found</p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Company</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="CompanyName"
                placeholder="Company Name"
                value={formData.CompanyName}
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
                  {isSubmitting ? "Adding..." : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
