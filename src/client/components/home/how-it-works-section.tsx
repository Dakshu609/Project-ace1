"use client";

import { motion } from "framer-motion";
import { FileText, Users, CheckCircle, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import { SectionHeader } from "@/client/components/shared/section-header";

const clientSteps = [
  { icon: FileText, title: "Post a job", description: "Describe your project, budget, and required skills." },
  { icon: Users, title: "Review proposals", description: "Compare freelancers and choose the best match." },
  { icon: CheckCircle, title: "Collaborate", description: "Work together with milestones and messaging." },
  { icon: Wallet, title: "Pay securely", description: "Release payment when you're satisfied with the work." },
];

const freelancerSteps = [
  { icon: Users, title: "Create profile", description: "Showcase skills, portfolio, and hourly rate." },
  { icon: FileText, title: "Find projects", description: "Browse jobs or get invited by clients." },
  { icon: CheckCircle, title: "Deliver work", description: "Complete milestones and communicate clearly." },
  { icon: Wallet, title: "Get paid", description: "Receive secure payments upon approval." },
];

function StepsList({ steps }: { steps: typeof clientSteps }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
            {i + 1}
          </div>
          <step.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="How it works"
          title="Simple process for everyone"
          description="Whether you're hiring or freelancing, get started in minutes."
        />
        <Tabs defaultValue="clients" className="mx-auto max-w-4xl">
          <TabsList className="mx-auto mb-10 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="clients">For Clients</TabsTrigger>
            <TabsTrigger value="freelancers">For Freelancers</TabsTrigger>
          </TabsList>
          <TabsContent value="clients">
            <StepsList steps={clientSteps} />
          </TabsContent>
          <TabsContent value="freelancers">
            <StepsList steps={freelancerSteps} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
