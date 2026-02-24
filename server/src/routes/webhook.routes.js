const express = require("express");
const router = express.Router();

router.post("/razorpay", (req, res) => {

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const crypto = require("crypto");

  const shasum = crypto.createHmac(
    "sha256",
    secret
  );

  shasum.update(JSON.stringify(req.body));

  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Webhook verified");
  }

  res.json({ status: "ok" });
});

module.exports = router;