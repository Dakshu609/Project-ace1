import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Button } from "@/client/components/ui/button";

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
const availabilityOptions = ["available", "busy", "away"];

interface FilterSidebarProps {
  categories: string[];
  selectedSkills?: string[];
  selectedAvailability?: string[];
  selectedCategory?: string;
  minRating?: string;
}

export function FilterSidebar({
  categories,
  selectedSkills = [],
  selectedAvailability = [],
  selectedCategory = "",
  minRating = "",
}: FilterSidebarProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Link href="/freelancers">
          <Button variant="ghost" size="sm" type="button">
            Clear
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" action="/freelancers">
          <FilterGroup title="Skills">
            {skillsList.map((skill) => (
              <CheckboxLine
                key={skill}
                name="skill"
                value={skill}
                checked={selectedSkills.includes(skill)}
                label={skill}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Minimum Rating">
            {[4.5, 4.0, 3.5].map((rating) => (
              <CheckboxLine
                key={rating}
                type="radio"
                name="rating"
                value={String(rating)}
                checked={minRating === String(rating)}
                label={`${rating}+ stars`}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Availability">
            {availabilityOptions.map((status) => (
              <CheckboxLine
                key={status}
                name="availability"
                value={status}
                checked={selectedAvailability.includes(status)}
                label={status}
                capitalize
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Experience">
            {experienceLevels.map((level) => (
              <CheckboxLine key={level} name="experience" value={level} label={level} capitalize />
            ))}
          </FilterGroup>

          <FilterGroup title="Category">
            <select
              name="category"
              defaultValue={selectedCategory}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FilterGroup>

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxLine({
  name,
  value,
  label,
  checked,
  type = "checkbox",
  capitalize = false,
}: {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  type?: "checkbox" | "radio";
  capitalize?: boolean;
}) {
  const id = `${name}-${value}`;

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        name={name}
        value={value}
        type={type}
        defaultChecked={checked}
        className="h-4 w-4 accent-primary"
      />
      <span className={capitalize ? "capitalize" : undefined}>{label}</span>
    </label>
  );
}
