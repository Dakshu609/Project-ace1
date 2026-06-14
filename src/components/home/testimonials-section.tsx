"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials } from "@/lib/data/mock";

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="Trusted by thousands"
          description="See what clients and freelancers say about Project Ace."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="interactive-lift h-full hover:border-primary/20">
                <CardContent className="p-6">
                  <StarRating rating={t.rating} />
                  <p className="mt-4 text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={t.avatar} alt={t.name} fill unoptimized />
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.role}, {t.company}
                      </p>
                    </div>
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
