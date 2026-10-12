import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required ,please provide username"],
      unique: [
        true,
        "username is already exist ,please provide another username",
      ],
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required,please provide email"],
      unique: [true, "email is already exist,please provide another email"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required,please provide password"],
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    console.log(err);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);
export default User;
