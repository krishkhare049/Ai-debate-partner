const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");


// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected
router.get("/me", protect, getMe);

module.exports = router;