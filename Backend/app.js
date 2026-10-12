import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/dbconnection.js";
import axios from "axios";
dotenv.config();

const app = express();
//middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

//cors configuration

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.get("/api/ipo", async (req, res) => {
  try {
    const response = await axios.get(
      "https://xflot.com/api/public/market/ipos",
      {
        params: {
          limit: 200,
        },
        timeout: 15000,
      },
    );

    const ipos = response.data.ipos || [];

    // Keep IPOs that are open or upcoming
    const popularIpos = ipos.filter(
      (ipo) => ipo.status === "OPEN" || ipo.status === "UPCOMING",
    );

    // Show open IPOs first
    popularIpos.sort((a, b) => {
      if (a.status === "OPEN" && b.status !== "OPEN") return -1;
      if (a.status !== "OPEN" && b.status === "OPEN") return 1;

      return (b.lastSubX ?? -1) - (a.lastSubX ?? -1);
    });

    res.json({
      ok: true,
      count: popularIpos.length,
      ipos: popularIpos,
      disclaimer: response.data.disclaimer,
    });
  } catch (error) {
    console.error("IPO API error:", error.response?.data || error.message);

    res.status(502).json({
      ok: false,
      message: "Failed to fetch IPO data",
    });
  }
});

app.get("/api/upcoming", async (req, res) => {
  try {
    const response = await axios.get(
      "https://xflot.com/api/public/market/ipos",
      {
        params: {
          status: "UPCOMING",
          limit: 50,
        },
        timeout: 15000,
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Upcoming IPO API error:",
      error.response?.data || error.message,
    );

    res.status(502).json({
      message: "Unable to fetch upcoming IPOs.",
    });
  }
});

app.get("/api/ipo/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await axios.get(
      `https://xflot.com/api/public/market/ipos/${encodeURIComponent(slug)}`,
      {
        timeout: 15000,
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "IPO details error:",
      error.response?.status || error.message,
    );

    res.status(error.response?.status === 404 ? 404 : 502).json({
      message:
        error.response?.status === 404
          ? "IPO not found."
          : "Unable to fetch IPO details.",
    });
  }
});

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    console.log("✅mongodb connect successfully");
    app.listen(PORT, () => {
      console.log(`server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌mongodb connection error", error);
  });

import healthcheckRoutes from "./src/routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRoutes);

import authRouter from "./src/routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

// import IpoRouter from "./src/routes/ipoRouter.routes.js";
// app.use("/api/ipo", IpoRouter);

export default app;
