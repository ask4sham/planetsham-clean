// src/lib/stripe.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function handleBoost(postId: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1P123456...", // ✅ Replace this with your real Stripe Price ID
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      postId,
    },
    success_url: "https://planetsham.com/boost?status=success",
    cancel_url: "https://planetsham.com/boost?status=cancel",
  });

  return session.url;
}
