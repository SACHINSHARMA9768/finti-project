import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connection successfully");
  } catch (error) {
    console.error("an error occure during connect db ", error);
    process.exit(1);
  }
};

export default connectDB;
