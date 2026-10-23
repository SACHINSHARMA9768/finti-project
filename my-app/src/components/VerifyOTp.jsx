import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  console.log("location ", location);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email is missing .Please register again");
      navigate("/register");
      return;
    }

    if (otp.length !== 6) {
      alert("Please enter a 6-digit otp");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/verify-email",
        { email, otp },
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message || "Otp verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
        <p className="text-gray-500 text-center mt-2">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digits OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-widest"
          />

          <button
            type="submit"
            className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
