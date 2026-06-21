import Stripe from "stripe";

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
  });
}

export const STRIPE_CONFIG = {
  currency: "usd",
  clientFeePercent: 3,
  freelancerFeePercent: 10,
  premiumFeeDiscount: 5,
} as const;
