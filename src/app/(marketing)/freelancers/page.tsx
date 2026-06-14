"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FreelancerCard } from "@/components/freelancers/freelancer-card";
import { FilterSidebar } from "@/components/freelancers/filter-sidebar";
import { PageHeader } from "@/components/shared/page-header";
import { freelancers } from "@/lib/data/mock";

export default function FreelancersPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...freelancers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "jobs":
        result.sort((a, b) => b.completedJobs - a.completedJobs);
        break;
    }

    return result;
  }, [search, sort]);

  return (
    <div className="container mx-auto page-padding">
      <PageHeader
        title="Browse Freelancers"
        description={`${filtered.length} verified developers ready to hire`}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, or title..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="jobs">Most Jobs</SelectItem>
          </SelectContent>
        </Select>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterSidebar />
        </div>
        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No freelancers match your search. Try different keywords.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((freelancer, i) => (
                <FreelancerCard
                  key={freelancer.id}
                  freelancer={freelancer}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
