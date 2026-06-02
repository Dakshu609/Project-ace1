"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data/mock";

const skillsList = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Figma",
  "Java",
  "Flutter",
  "WordPress",
];

const experienceLevels = ["junior", "mid", "senior", "expert"];

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setMinRating(null);
    setAvailability([]);
    onFilterChange?.({});
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold">Skills</h4>
          <div className="space-y-2">
            {skillsList.map((skill) => (
              <div key={skill} className="flex items-center gap-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={() => toggleSkill(skill)}
                />
                <Label htmlFor={`skill-${skill}`} className="text-sm font-normal">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Minimum Rating</h4>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={minRating === rating}
                  onCheckedChange={() =>
                    setMinRating(minRating === rating ? null : rating)
                  }
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm font-normal">
                  {rating}+ stars
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Availability</h4>
          <div className="space-y-2">
            {["available", "busy", "away"].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Checkbox
                  id={`avail-${status}`}
                  checked={availability.includes(status)}
                  onCheckedChange={() =>
                    setAvailability((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    )
                  }
                />
                <Label htmlFor={`avail-${status}`} className="text-sm font-normal capitalize">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Experience</h4>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <Checkbox id={`exp-${level}`} />
                <Label htmlFor={`exp-${level}`} className="text-sm font-normal capitalize">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Category</h4>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox id={`cat-${cat}`} />
                <Label htmlFor={`cat-${cat}`} className="text-sm font-normal">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
