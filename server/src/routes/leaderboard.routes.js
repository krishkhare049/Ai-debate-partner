const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Debate = require("../models/Debate");

router.get("/", async (req, res) => {
  try {

    const leaderboard = await Debate.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: "$user",
          completed: { $sum: 1 }
        }
      },
      {
        $sort: { completed: -1 }
      },
      {
        $limit: 20
      }
    ]);

    const users = await User.find({
      _id: { $in: leaderboard.map(l => l._id) }
    }).select("name plan");

    const result = leaderboard.map((item) => {
      const user = users.find(
        (u) => u._id.toString() === item._id.toString()
      );

      return {
        userId: item._id,
        name: user?.name || "User",
        plan: user?.plan || "free",
        completed: item.completed
      };
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;