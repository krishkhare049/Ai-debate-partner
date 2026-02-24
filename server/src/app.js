const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const debateRoutes = require("./routes/debate.routes");
const resultRoutes = require("./routes/result.routes");
const publicRoutes = require("./routes/public.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Logging
app.use(morgan("dev"));

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/debate", debateRoutes);

app.use("/api/result", resultRoutes);

app.use("/api/public", publicRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/payment", paymentRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "AI Debate API running 🚀" });
});

module.exports = app;