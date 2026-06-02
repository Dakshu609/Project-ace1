"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import { services, categories } from "@/lib/data/mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Services</h1>
        <p className="mt-2 text-muted-foreground">
          Ready-made packages from top freelancers
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <Card key={service.id} className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-44">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
            </div>
            <CardContent className="p-5">
              <Badge variant="secondary" className="mb-2">
                {service.category}
              </Badge>
              <h3 className="font-semibold line-clamp-2">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={service.freelancerAvatar}
                    alt={service.freelancerName}
                    fill
                    unoptimized
                  />
                </div>
                <Link
                  href={`/freelancers/${service.freelancerId}`}
                  className="text-sm hover:text-primary"
                >
                  {service.freelancerName}
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StarRating rating={service.rating} />
                <span className="text-sm text-muted-foreground">
                  {service.deliveryDays} days
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(service.price)}
                </span>
                <Link href={`/freelancers/${service.freelancerId}`}>
                  <Button size="sm">Order Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
