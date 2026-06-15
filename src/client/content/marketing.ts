import type { FAQ, PricingPlan } from "@/shared/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "For clients and freelancers validating the platform.",
    features: [
      "Browse verified freelancers",
      "Post limited job requests",
      "Basic messaging",
      "Standard marketplace support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For teams hiring technical talent regularly.",
    features: [
      "Unlimited job posts",
      "Priority listing review",
      "Saved freelancer shortlists",
      "Advanced marketplace filters",
      "Reduced platform fees",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 99,
    period: "month",
    description: "For teams that need managed hiring workflows.",
    features: [
      "Team collaboration",
      "Contract and payment oversight",
      "Dedicated marketplace support",
      "Custom reporting exports",
      "SLA-backed response targets",
    ],
  },
];

export const faqs: FAQ[] = [
  {
    id: "clients",
    question: "How does Project Ace work for clients?",
    answer:
      "Clients post a project, compare verified freelancer profiles, start conversations, create contracts, and track payments from the dashboard.",
  },
  {
    id: "freelancers",
    question: "How do freelancers use the platform?",
    answer:
      "Freelancers create a profile, publish services, receive messages, submit proposals, track contracts, and update availability from their dashboard.",
  },
  {
    id: "payments",
    question: "Are payments fully integrated?",
    answer:
      "The database and dashboard are prepared for payment provider records, escrow states, refunds, and failed payments. A live provider such as Stripe still needs production credentials and webhooks.",
  },
  {
    id: "security",
    question: "How is access controlled?",
    answer:
      "Supabase Auth manages sessions, route proxy protects app pages, and row-level security limits database records to public marketplace data, resource owners, and admins.",
  },
  {
    id: "data",
    question: "Does the UI use real marketplace data?",
    answer:
      "Marketplace listings, category counts, dashboards, messages, and admin counters are read from Supabase. Static marketing copy is kept separately from database data.",
  },
];
