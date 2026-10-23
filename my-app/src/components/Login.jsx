import axios from "axios";
import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFromData] = useState({ email: "", password: "" });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        formData,
        { withCredentials: true },
      );
      setMessage(response.data.message);
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      setMessage(error.response.data.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          if have not registered?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Register
          </Link>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
