import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Briefcase,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import {
  getFreelancerById,
  getReviewsByFreelancerId,
} from "@/lib/data/mock";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const freelancer = getFreelancerById(id);
  return {
    title: freelancer ? `${freelancer.name} — Freelancer Profile` : "Freelancer",
  };
}

export default async function FreelancerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const freelancer = getFreelancerById(id);

  if (!freelancer) notFound();

  const freelancerReviews = getReviewsByFreelancerId(id);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <Card className="overflow-hidden">
        <div className="gradient-bg h-32" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-background shadow-lg">
              <Image
                src={freelancer.avatar}
                alt={freelancer.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">{freelancer.name}</h1>
                  <p className="text-lg text-muted-foreground">{freelancer.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {freelancer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {freelancer.responseTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {freelancer.completedJobs} jobs completed
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/messages?freelancer=${freelancer.id}`}>
                    <Button variant="outline" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                  </Link>
                  <Link href="/post-job">
                    <Button className="gap-2">Hire Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <StarRating rating={freelancer.rating} />
            <span className="text-muted-foreground">
              ({freelancer.reviewCount} reviews)
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(freelancer.hourlyRate)}/hr
            </span>
            <Badge
              variant={
                freelancer.availability === "available" ? "success" : "warning"
              }
            >
              {freelancer.availability}
            </Badge>
          </div>

          <p className="mt-6 max-w-3xl text-muted-foreground">{freelancer.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {freelancer.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Portfolio</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {freelancer.portfolio.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
            <div className="space-y-4">
              {freelancerReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                freelancerReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src={review.clientAvatar}
                              alt={review.clientName}
                              fill
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-medium">{review.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {review.projectTitle}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  freelancer.availability === "available" ? "success" : "warning"
                }
                className="capitalize"
              >
                {freelancer.availability}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Typically responds {freelancer.responseTime}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {freelancer.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    <Globe className="mr-1 h-3 w-3" />
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed Jobs</span>
                <span className="font-medium">{freelancer.completedJobs}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium capitalize">{freelancer.experience}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">2023</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
