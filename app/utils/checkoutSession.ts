import Stripe from "stripe";
import { appConfig } from "../config/app";
import { ObjectId } from "mongodb";
const stripe = new Stripe(appConfig.stripeKey? appConfig.stripeKey : "sk_test_51NVqGgHceDFN1DB63kn6uOZqCsdoDOOFLaohuq01bd30EgcbwnXgbt2mqewni4PKXu8xM3QM2JMsoWW7K8ZAbIPr00AYs6rUTi");

export const createCheckoutSession = async (
  name: string,
  unitPrice: number,
  email: string,
  orderRef: string,
  productId: ObjectId,
) => {
  console.log("reached here, going to create a checkout session");
  
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
    success_url: `${appConfig.frontEndUrl}/api/orders/${orderRef}/status?status=PAID`,
    cancel_url: `${appConfig.frontEndUrl}/product/${productId}`,
    mode: "payment",
  });
  console.log(session.url, "created a checkout session");
  return session.url;
};
