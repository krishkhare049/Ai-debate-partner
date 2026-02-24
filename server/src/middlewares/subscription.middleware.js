const User = require("../models/User");

const checkSubscription = async (req, res, next) => {

  const user = await User.findById(req.user._id);

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