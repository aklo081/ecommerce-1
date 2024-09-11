const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderControllers");
const { auth } = require("../middleware/auth");

router.post("/api/payment/initiate", auth, orderController.initiatePayment);
router.post("/api/payment/verify", auth, orderController.verifyPayment);

module.exports = router;