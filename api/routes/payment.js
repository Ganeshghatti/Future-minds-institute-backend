import express from "express";
const router = express.Router();

import { subscribeUser, verifyPaymentSubscription } from "../controllers/auth/razorpay.js";

router.post("/subscribe/:userId", subscribeUser);
router.post("/verify-payment/:userId", verifyPaymentSubscription);

export default router;