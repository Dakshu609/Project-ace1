import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { FreelancerCard } from "@/components/freelancers/freelancer-card";
import { freelancers } from "@/lib/data/mock";

export function TopFreelancersSection() {
  const topFreelancers = freelancers.slice(0, 4);

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
          {topFreelancers.map((freelancer, i) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
