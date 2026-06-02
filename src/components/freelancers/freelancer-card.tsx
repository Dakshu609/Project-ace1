"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import type { FreelancerProfile } from "@/lib/types";

interface FreelancerCardProps {
  freelancer: FreelancerProfile;
  index?: number;
}

export function FreelancerCard({ freelancer, index = 0 }: FreelancerCardProps) {
  const availabilityColors = {
    available: "success",
    busy: "warning",
    away: "secondary",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Link href={`/freelancers/${freelancer.id}`}>
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-border group-hover:ring-primary/50">
                <Image
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/freelancers/${freelancer.id}`}
                    className="font-semibold hover:text-primary"
                  >
                    {freelancer.name}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {freelancer.title}
                  </p>
                </div>
                <Badge variant={availabilityColors[freelancer.availability]}>
                  {freelancer.availability}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <StarRating rating={freelancer.rating} />
                <span className="text-muted-foreground">
                  ({freelancer.reviewCount})
                </span>
                <span className="font-semibold text-primary">
                  {formatCurrency(freelancer.hourlyRate)}/hr
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {freelancer.completedJobs} jobs
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {freelancer.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {freelancer.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.skills.length - 4}
              </Badge>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href={`/freelancers/${freelancer.id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                View Profile
              </Button>
            </Link>
            <Link href={`/messages?freelancer=${freelancer.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                Hire Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
