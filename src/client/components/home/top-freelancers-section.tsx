import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { SectionHeader } from "@/client/components/shared/section-header";
import { FreelancerCard } from "@/client/components/freelancers/freelancer-card";
import type { FreelancerProfile } from "@/shared/types";

export function TopFreelancersSection({
  freelancers,
}: {
  freelancers: FreelancerProfile[];
}) {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
          <SectionHeader
            badge="Top Talent"
            title="Featured freelancers"
            description="Hand-picked developers with proven track records."
            centered={false}
            className="mb-0"
          />
          <Link href="/freelancers">
            <Button variant="outline" className="gap-2 shrink-0">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {freelancers.length === 0 ? (
            <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground md:col-span-2">
              Featured freelancers will appear after verified profiles are added.
            </div>
          ) : (
            freelancers.map((freelancer, i) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
