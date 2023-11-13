import Stripe from "stripe";
import { appConfig } from "../config/app";
import { ObjectId } from "mongodb";
const stripe = new Stripe(
  "sk_test_51DvuBkFGyP6ff4jdCRaS7aV5DA9545fTPM1W36pTwyCvu0XulahJyrOUBZrGLWtqSwluKNNAmQvnYLN4EfceLCFd00SBDIhaIg",
);

export const createCheckoutSession = async (
  name: string,
  unitPrice: number,
  email: string,
  orderRef: string,
  productId: ObjectId,
) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name,
          },
          unit_amount: unitPrice * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${appConfig.appUrl}/api/orders/${orderRef}/status?status=PAID`,
    cancel_url: `${appConfig.frontEndUrl}/product/${productId}`,
    mode: "payment",
  });

  return session.url;
};
