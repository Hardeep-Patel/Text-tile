import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import API from '../Components/Process'
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Username || !Password) {
      setError("Both fields are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API}User/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username, Password }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === true) {
        // Store user data in cookies
        Cookies.set("UserID", result?.data?.UserID);
        Cookies.set("UserType", result?.data?.UserType);
        Cookies.set("Username", result?.data?.Username);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard"); // Redirect user to dashboard after login
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: result.message || "Please check your Username and Password.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error making API call:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Please try again later.",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-5">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="Username"
              placeholder="Enter your Username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"} // Toggle password visibility
      placeholder="Enter your Password"
      value={Password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
      required
      minLength="6"
      maxLength="20"
      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$"
      title="Password must be between 6-20 characters and include at least one letter and one number."
    />
    <span
      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </span>
  </div>
  <small className="text-red-500">
    {Password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(Password) &&
      "Password must be between 6-20 characters and include at least one letter and one number."}
  </small>
</div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}