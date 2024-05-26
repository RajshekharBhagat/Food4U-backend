import Stripe from "stripe";
import asyncHandler from "../utils/AsyncHandler";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Order from "../models/order.model";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckoutSessionRequest = {
  cartItem: {
    menuId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    username: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};
const createLineItem = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItem.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuId.toString()
    );
    if (!menuItem) {
      throw new ApiError(404, "MenuItem not found");
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};
const createSession = async (
  lineItem: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string,
  deliveryDetails: {
    email: string;
    username: string;
    addressLine1: string;
    city: string;
  }
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItem,
    mode: "payment",
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
    metadata: {
      orderId,
      restaurantId,
    },
    customer_email: deliveryDetails.email,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "inr",
          },
        },
      },
    ],
  });
  return sessionData;
};
const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const checkOutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkOutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new ApiError(404, "Restaurant Not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkOutSessionRequest.deliveryDetails,
      cartItem: checkOutSessionRequest.cartItem,
      createdAt: new Date(),
    });

    const lineItems = createLineItem(checkOutSessionRequest, restaurant.menu);

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString(),
      checkOutSessionRequest.deliveryDetails
    );
    if (!session.url) {
      return new ApiResponse(500, "Error creating stripe session");
    }
    await newOrder.save();
    res.json({ url: session.url });
  }
);

const stripeWebhookHandler = asyncHandler(
  async (req: Request, res: Response) => {
    let event;
    const signature = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      signature as string,
      STRIPE_ENDPOINT_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const order = await Order.findById(event.data.object.metadata?.orderId);
      if(!order) {
        throw new ApiError(404, 'Order not found');
      }
      order.totalAmount = event.data.object.amount_total;
      order.status = 'paid';
      await order.save();
     }
     res.status(200).send();
  }
);

export { createCheckoutSession, stripeWebhookHandler };
