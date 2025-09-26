import express from "express";
import userAuth from "../middlewares/user-auth.js";
const router = express.Router();

import { subscribeUser, verifyPaymentSubscription } from "../controllers/auth/razorpay.js";


router.post("/subscribe/:userId", userAuth, subscribeUser);
router.post("/verify-payment/:userId", userAuth, verifyPaymentSubscription);

export default router;