import User from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, null, "Email and otp are required");
    }

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, null, "User not found");

    if (user.isEmailVerified)
      throw new ApiError(400, null, "Email is already verified");

    if (!user.emailVerificationOTP)
      throw new ApiError(400, null, "OTP not found");

    if (user.emailVerificationOTPExpiry < new Date())
      throw new ApiError(400, null, "OTP has expired");

    if (user.emailVerificationOTP !== otp)
      throw new ApiError(400, null, "Invalid OTP");

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email verified successfully"));
  } catch (error) {
    throw new ApiError(500, null, error.message);
  }
};

export {generateOTP,verifyEmailOTP};