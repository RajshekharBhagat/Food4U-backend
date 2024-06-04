import express from "express";
import { jwtCheck, verifyJwt } from "../middlewares/auth.middleware";
import { createCheckoutSession, getOrders, stripeWebhookHandler, updateOrder } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.route('/checkout/create-checkout-session').post(
    jwtCheck,
    verifyJwt,
    createCheckoutSession,
);

orderRouter.route('/checkout/webhook').post(stripeWebhookHandler);

orderRouter.route('/getOrders').get(
    jwtCheck,
    verifyJwt,
    getOrders,
);

orderRouter.route('/:orderId/status').patch(
    jwtCheck,
    verifyJwt,
    updateOrder,
)

export default orderRouter;
