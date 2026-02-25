const User = require("../models/User");

const checkSubscription = async (req, res, next) => {

  const user = await User.findById(req.user._id);
  // console.log("Checking subscription for user:", user._id, "Plan:", user.plan, "Expires at:", user.planExpiresAt);

  if (
    user.plan !== "free" &&
    user.planExpiresAt &&
    new Date() > user.planExpiresAt
  ) {
    user.plan = "free";
    user.planExpiresAt = null;

    await user.save();
  }

  next();
};

module.exports = { checkSubscription };