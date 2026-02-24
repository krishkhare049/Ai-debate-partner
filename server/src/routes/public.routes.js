const express = require("express");
const router = express.Router();

const Debate = require("../models/Debate");
const Message = require("../models/Message");
const Result = require("../models/Result");

// Public debate view
router.get("/debate/:id", async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);

    if (!debate || !debate.isPublic) {
      return res.status(404).json({
        message: "Debate not found"
      });
    }

    const messages = await Message.find({
      debate: debate._id
    }).sort({ createdAt: 1 });

    const result = await Result.findOne({
      debate: debate._id
    });

    res.json({
      debate,
      messages,
      result
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get public debates list
router.get("/debates", async (req, res) => {
  try {

    const debates = await Debate.find({
      isPublic: true,
      status: "completed"
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("topic createdAt");

    res.json(debates);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;