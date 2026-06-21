import { Search, Users } from "lucide-react";
import { Input } from "@/client/components/ui/input";
import { Button } from "@/client/components/ui/button";
import { FreelancerCard } from "@/client/components/freelancers/freelancer-card";
import { FilterSidebar } from "@/client/components/freelancers/filter-sidebar";
import { PageHeader } from "@/client/components/shared/page-header";
import { EmptyState } from "@/client/components/shared/empty-state";
import { asString } from "@/shared/utils";
import { getCategories, getFreelancers } from "@/server/marketplace/queries";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function asArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function FreelancersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = asString(params.search) ?? "";
  const sort = asString(params.sort) ?? "rating";
  const category = asString(params.category) ?? "";
  const skills = asArray(params.skill);
  const availability = asArray(params.availability);
  const rating = asString(params.rating) ?? "";

  const [categories, freelancers] = await Promise.all([
    getCategories(),
    getFreelancers({
      search,
      sort,
      category,
      skills,
      availability,
      minRating: rating ? Number(rating) : undefined,
    }),
  ]);

  return (
    <div className="container mx-auto page-padding">
      <PageHeader
        title="Browse Freelancers"
        description={`${freelancers.length} verified developers ready to hire`}
      />

      <form className="mb-6 flex flex-col gap-4 sm:flex-row" action="/freelancers">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by name, skill, or title..."
            className="pl-9"
            defaultValue={search}
          />
        </div>
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:w-[200px]"
        >
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="jobs">Most Jobs</option>
        </select>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <FilterSidebar
            categories={categories}
            selectedSkills={skills}
            selectedAvailability={availability}
            selectedCategory={category}
            minRating={rating}
          />
        </div>
        <div className="flex-1">
          {freelancers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No freelancers found"
              description="No verified freelancer profiles match this search yet."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {freelancers.map((freelancer, i) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
