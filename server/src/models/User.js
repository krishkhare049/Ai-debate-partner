const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: null
    },

    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free"
    },

    debateCount: {
      type: Number,
      default: 0
    },

    wins: {
      type: Number,
      default: 0
    },
    dailyDebates: {
  type: Number,
  default: 0
},

lastDebateDate: {
  type: Date,
  default: null
},
planExpiresAt: {
  type: Date,
  default: null
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);