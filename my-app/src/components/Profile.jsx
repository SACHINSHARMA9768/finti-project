import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/auth/profile",
        { withCredentials: true },
      );

      setUser(response.data.data);

      setFormData({
        username: response.data.data.username || "",
        email: response.data.data.email || "",
      });
    } catch (error) {
      console.log("Error:", error);
      console.log("Response:", error.response);
      console.log("Message:", error.message);
      console.log("Server Error:", error.response?.data);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/auth/profile",
        formData,
        { withCredentials: true },
      );

      setUser(response.data.data);
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error.response.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* Header Background */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black/5"></div>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pb-8 sm:px-10">
            {/* Avatar */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {user.username}
              </h1>

              <p className="mt-1 text-gray-500">My Profile</p>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-gray-200"></div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Username
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* User ID */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  User ID
                </p>

                <p className="break-all text-sm font-medium text-gray-700">
                  {user._id}
                </p>
              </div>

              {/* Update Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:from-gray-400 disabled:to-gray-400"
              >
                Update
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Keep your profile information up to date
        </p>
      </div>
    </div>
  );
};

export default Profile;
