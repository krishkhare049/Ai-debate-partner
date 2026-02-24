const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    plan: String,

    paymentId: String,
    orderId: String,

    amount: Number,

    status: {
      type: String,
      default: "active"
    },

    expiresAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);