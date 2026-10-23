import User from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import { generateOTP } from "./OTP.js";
import sendOTPEmail from "../utils/Email.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, null, "user not found", []);
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, null, "internal server error", []);
  }
};

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    throw new ApiError(400, null, "Email,username,password is required");
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(400, null, "username or email already exist", []);
  }

  const otp = generateOTP();
  console.log(otp);

  const user = new User({
    email,
    password,
    username,
    isEmailVerified: false,
    emailVerificationOTP: otp,
    emailVerificationOTPExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });

  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  if (!createdUser) {
    throw new ApiError(500, null, "internal server error", []);
  }

  await sendOTPEmail(email, otp);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, null, "Email is required", []);
  }

  if (!password) {
    throw new ApiError(400, null, "Password is required", []);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, null, "User does not exist", []);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, null, "Invalid credentials", []);
  }

  if (!user.isEmailVerified)
    throw new ApiError(403, null, "Please verify your email first");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: "",
    },
    new: true,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout "));
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, null, "unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, null, "invalid refreshToken");
  }
};

const getProfile = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
};

const updateProfile = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email)
    throw new ApiError(400, null, "Nothing to update", []);

  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(400, null, "User not found", []);

  if (username) user.username = username;
  if (email) user.email = email;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
};

export {
  registerUser,
  login,
  logoutUser,
  refreshAccessToken,
  getProfile,
  updateProfile,
};
