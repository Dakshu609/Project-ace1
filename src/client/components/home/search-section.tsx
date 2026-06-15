"use client";

import { Search } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";

export function SearchSection({ categories }: { categories: string[] }) {
  return (
    <section className="relative z-10 container mx-auto -mt-8 px-4 lg:px-8">
      <form action="/freelancers" className="rounded-2xl border bg-card p-6 shadow-xl">
        <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Skill, role, or keyword"
              className="pl-9"
            />
          </div>
          <Select name="category">
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
          <Button className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search Talent
          </Button>
        </div>
      </form>
    </section>
  );
}
