import express from "express";
import { jwtCheck, verifyJwt } from "../middlewares/auth.middleware";
import { createCheckoutSession, stripeWebhookHandler } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.route('/checkout/create-checkout-session').post(
    jwtCheck,
    verifyJwt,
    createCheckoutSession,
);

orderRouter.route('/checkout/webhook').post(stripeWebhookHandler);

export default orderRouter;
