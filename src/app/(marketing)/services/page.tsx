import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Search } from "lucide-react";
import { Input } from "@/client/components/ui/input";
import { Card, CardContent } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { StarRating } from "@/client/components/shared/star-rating";
import { PageHeader } from "@/client/components/shared/page-header";
import { EmptyState } from "@/client/components/shared/empty-state";
import { formatCurrency } from "@/shared/utils";
import { getCategories, getServices } from "@/server/marketplace/queries";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = asString(params.search) ?? "";
  const category = asString(params.category) ?? "all";
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices({ search, category }),
  ]);

  return (
    <div className="container mx-auto page-padding">
      <PageHeader
        title="Browse Services"
        description="Ready-made packages from verified freelancers"
      />

      <form className="mb-6 flex flex-col gap-4 sm:flex-row" action="/services">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search services..."
            className="pl-9"
            defaultValue={search}
          />
        </div>
        <select
          name="category"
          defaultValue={category}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:w-[220px]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {services.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No active services"
          description="Verified freelancers have not published matching service packages yet."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className="interactive-lift overflow-hidden hover:border-primary/20"
            >
              {service.image ? (
                <div className="relative h-44">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center bg-muted text-muted-foreground">
                  <PackageSearch className="h-10 w-10" />
                </div>
              )}
              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {service.category}
                </Badge>
                <h3 className="line-clamp-2 font-semibold">{service.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
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
                    className="text-sm transition-colors hover:text-primary"
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
      )}
    </div>
  );
}
