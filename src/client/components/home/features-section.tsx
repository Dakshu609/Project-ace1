"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Clock, Headphones } from "lucide-react";
import { Card, CardContent } from "@/client/components/ui/card";
import { SectionHeader } from "@/client/components/shared/section-header";

const features = [
  {
    icon: Shield,
    title: "Verified Freelancers",
    description:
      "Every developer passes identity verification, skill tests, and portfolio review.",
  },
  {
    icon: Zap,
    title: "Secure Payments",
    description:
      "Escrow protection ensures you only pay when work meets your standards.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description:
      "Match with available talent and kick off projects within 24 hours.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Dedicated support team ready to help clients and freelancers anytime.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Why Project Ace"
          title="Built for trust and speed"
          description="Everything you need to hire confidently and deliver projects on time."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="interactive-lift h-full border-transparent bg-muted/30 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
