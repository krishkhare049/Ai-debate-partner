const mongoose = require("mongoose");

const Debate = require("../models/Debate");
const Message = require("../models/Message");
const Result = require("../models/Result");

const {
  generateDebateReply,
  scoreDebate,
} = require("../services/ai.service");

// ================= HELPER =================

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ================= START DEBATE =================

const startDebate = async (req, res) => {
  try {
    const { topic, userStance, personality } = req.body;
    const user = req.user;

    if (!topic || !userStance) {
      return res.status(400).json({
        message: "Topic and stance are required",
      });
    }

    const today = new Date().toDateString();

    // Reset counter daily
    if (
      !user.lastDebateDate ||
      new Date(user.lastDebateDate).toDateString() !== today
    ) {
      user.dailyDebates = 0;
    }

    // Free plan limit
    if (user.plan === "free" && user.dailyDebates >= 5) {
      return res.status(403).json({
        message: "Daily debate limit reached. Upgrade plan.",
      });
    }

    user.dailyDebates += 1;
    user.lastDebateDate = new Date();
    await user.save();

    const aiStance = userStance === "support" ? "oppose" : "support";

    const debate = await Debate.create({
      user: user._id,
      topic,
      userStance,
      aiStance,
      personality: personality || "neutral",
      status: "active",
    });

    res.json(debate);

  } catch (error) {
    console.error("START DEBATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= SEND MESSAGE =================

const sendMessage = async (req, res) => {
  try {
    const { debateId, content } = req.body;

    if (!debateId || !content) {
      console.log("Missing debateId or content:", { debateId, content });
      return res.status(400).json({
        message: "debateId and content required",
      });
    }

    if (!isValidId(debateId)) {
      cosnole.log("Invalid debateId format:", debateId);
      return res.status(400).json({
        message: "Invalid debate ID",
      });
    }

    const debate = await Debate.findOne({
      _id: debateId,
      user: req.user._id,
    });

    if (!debate) {
      conmsole.log("Debate not found for ID:", debateId);
      return res.status(404).json({
        message: "Debate not found",
      });
    }

    if (debate.status === "completed") {
      console.log("Attempt to send message to completed debate ID:", debateId);
      return res.status(400).json({
        message: "Debate already completed",
      });
    }

    // Save user message
    const userMsg = await Message.create({
      debate: debateId,
      sender: "user",
      content,
    });

    // Get conversation history
    const messages = await Message.find({
      debate: debateId,
    }).sort({ createdAt: 1 });

    // Generate AI reply
    const aiReply = await generateDebateReply(
      debate.topic,
      debate.aiStance,
      messages,
      debate.personality
    );

    const aiMsg = await Message.create({
      debate: debateId,
      sender: "ai",
      content: aiReply,
    });

    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= END DEBATE =================

const endDebate = async (req, res) => {
  try {
    const { debateId, isPublic } = req.body;

    if (!debateId) {
      return res.status(400).json({
        message: "Debate ID required",
      });
    }

    if (!isValidId(debateId)) {
      return res.status(400).json({
        message: "Invalid debate ID",
      });
    }

    const debate = await Debate.findOne({
      _id: debateId,
      user: req.user._id,
    });

    if (!debate) {
      return res.status(404).json({
        message: "Debate not found",
      });
    }

    const messages = await Message.find({
      debate: debateId,
    }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(400).json({
        message: "No messages to score",
      });
    }

    const resultData = await scoreDebate(messages);

    const result = await Result.create({
      debate: debateId,
      winner: resultData.winner,
      scores: {
        logic: resultData.logic,
        persuasion: resultData.persuasion,
        clarity: resultData.clarity,
      },
      analysis: resultData.analysis,
    });

    debate.status = "completed";
    debate.isPublic = !!isPublic;

    await debate.save();

    res.json(result);

  } catch (error) {
    console.error("END DEBATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET HISTORY =================

const getHistory = async (req, res) => {
  try {
    const debates = await Debate.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(debates);

  } catch (error) {
    console.error("HISTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE DEBATE =================

const getDebate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid debate ID",
      });
    }

    const debate = await Debate.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!debate) {
      return res.status(404).json({
        message: "Debate not found",
      });
    }

    const messages = await Message.find({
      debate: id,
    }).sort({ createdAt: 1 });

    res.json({
      debate,
      messages,
    });

  } catch (error) {
    console.error("GET DEBATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startDebate,
  sendMessage,
  endDebate,
  getHistory,
  getDebate,
};