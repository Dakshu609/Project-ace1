"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/client/components/ui/button";

interface HeroCounters {
  totalUsers: number;
  activeProjects: number;
  verifiedFreelancers: number;
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return value.toLocaleString();
}

export function HeroSection({ counters }: { counters: HeroCounters }) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container mx-auto section-padding px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{formatCount(counters.verifiedFreelancers)} verified coding freelancers</span>
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Hire Top Coding Talent{" "}
            <span className="gradient-text">Faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Connect with elite developers, designers, and engineers. Post projects,
            browse services, and build your dream team on Project Ace.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/post-job">
              <Button size="lg" className="gap-2">
                Post a Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/freelancers">
              <Button size="lg" variant="outline">
                Browse Freelancers
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <span className="block text-2xl font-bold text-foreground">
                {formatCount(counters.verifiedFreelancers)}
              </span>
              Verified Freelancers
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <span className="block text-2xl font-bold text-foreground">
                {formatCount(counters.activeProjects)}
              </span>
              Active Projects
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <span className="block text-2xl font-bold text-foreground">
                {formatCount(counters.totalUsers)}
              </span>
              Registered Users
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
