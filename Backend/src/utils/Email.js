import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.models.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your account",
    html: `
         <div>
        <h2>Notes App Email Verification</h2>
        <p>Your OTP is : </p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p> If you did not create this account ,ignore this email.</p>
        </div>
        `,
  });
};

export default sendOTPEmail;