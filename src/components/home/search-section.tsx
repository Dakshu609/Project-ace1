"use client";

import { Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data/mock";

export function SearchSection() {
  return (
    <section className="relative z-10 container mx-auto -mt-8 px-4 lg:px-8">
      <div className="rounded-2xl border bg-card p-6 shadow-xl">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Skill or keyword (e.g. React, Python)" className="pl-9" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Budget" className="pl-9" type="number" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Location" className="pl-9" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search Talent
          </Button>
        </div>
      </div>
    </section>
  );
}
