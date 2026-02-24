const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

// Create order
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    let amount = 0;

    if (plan === "pro") amount = 19900;      // ₹199
    if (plan === "premium") amount = 49900;  // ₹499

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed"
      });
    }

    const user = await User.findById(req.user._id);

    // Plan duration (30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update user
    user.plan = plan;
    user.planExpiresAt = expiresAt;

    await user.save();

    // Save subscription
    await Subscription.create({
      user: user._id,
      plan,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      expiresAt
    });

    res.json({
      message: "Payment successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};