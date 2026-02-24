const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const Debate = require("../models/Debate");
const { protect } = require("../middlewares/auth.middleware");

// GET RESULT BY DEBATE ID
router.get("/:debateId", protect, async (req, res) => {
  try {
    const { debateId } = req.params;

    // Check debate ownership
    const debate = await Debate.findOne({
      _id: debateId,
      user: req.user._id,
    });

    if (!debate) {
      return res.status(404).json({
        message: "Debate not found",
      });
    }

    const result = await Result.findOne({
      debate: debateId,
    });

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.json(result);

  } catch (error) {
    console.error("GET RESULT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;