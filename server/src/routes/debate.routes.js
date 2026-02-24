const express = require("express");
const router = express.Router();

const {
  startDebate,
  sendMessage,
  endDebate,
  getHistory,
  getDebate
} = require("../controllers/debate.controller");

const { protect } = require("../middlewares/auth.middleware");
const { checkSubscription } =
  require("../middlewares/subscription.middleware");


router.post("/start", protect, checkSubscription, startDebate);
router.post("/message", protect, checkSubscription, sendMessage);
router.post("/end", protect, checkSubscription, endDebate);
router.get("/history", protect, checkSubscription, getHistory);
router.get("/:id", protect, checkSubscription, getDebate);


module.exports = router;