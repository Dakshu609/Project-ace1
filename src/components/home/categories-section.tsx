"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Server,
  Layout,
  Palette,
  Code2,
  Coffee,
  Layers,
  FileCode,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { popularCategories } from "@/lib/data/mock";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Server,
  Layout,
  Palette,
  Code2,
  Coffee,
  Layers,
  FileCode,
};

export function CategoriesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Categories"
          title="Popular coding categories"
          description="Find specialists in every technology stack and discipline."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {popularCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Code2;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/freelancers?category=${encodeURIComponent(cat.name)}`}>
                  <Card className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat.count.toLocaleString()} freelancers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
