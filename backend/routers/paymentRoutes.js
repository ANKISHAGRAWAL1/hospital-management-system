const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
  createCashPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-order", protect("patient"), createPaymentOrder);

router.post("/verify", protect("patient"), verifyPayment);

router.post("/cash", protect("patient"), createCashPayment);

module.exports = router;