import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;