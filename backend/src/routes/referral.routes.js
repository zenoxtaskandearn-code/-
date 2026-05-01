const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { getReferralStats } = require("../controllers/referral.controller");

const router = express.Router();

router.get("/stats", authenticate, getReferralStats);

module.exports = router;
