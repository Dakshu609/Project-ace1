"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { formatCurrency } from "@/lib/utils";
import { projects } from "@/lib/data/mock";

const statusVariant = {
  open: "success",
  in_progress: "warning",
  completed: "secondary",
} as const;

export function RecentProjectsSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
          <SectionHeader
            badge="Projects"
            title="Recent job postings"
            description="Latest opportunities from clients hiring now."
            centered={false}
            className="mb-0"
          />
          <Link href="/post-job">
            <Button variant="outline" className="gap-2 shrink-0">
              Post a Job
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.clientName} · {project.category}
                      </p>
                    </div>
                    <Badge variant={statusVariant[project.status]}>
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-primary">
                      {formatCurrency(project.budget)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {project.proposals} proposals
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
