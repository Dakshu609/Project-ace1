import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { proposals, freelancers } from "@/lib/data/mock";

const sidebarLinks = [
  { href: "/dashboard/freelancer", label: "Overview", icon: "LayoutDashboard" as const },
  { href: "/dashboard/freelancer#earnings", label: "Earnings", icon: "DollarSign" as const },
  { href: "/dashboard/freelancer#jobs", label: "Active Jobs", icon: "Briefcase" as const },
  { href: "/dashboard/freelancer#proposals", label: "Proposals", icon: "FileText" as const },
  { href: "/dashboard/freelancer#reviews", label: "Reviews", icon: "Star" as const },
  { href: "/dashboard/freelancer#portfolio", label: "Portfolio", icon: "Image" as const },
  { href: "/dashboard/freelancer#settings", label: "Settings", icon: "Settings" as const },
  { href: "/messages", label: "Messages", icon: "MessageSquare" as const },
];

const proposalStatus = {
  pending: "warning",
  accepted: "success",
  rejected: "secondary",
} as const;

export default function FreelancerDashboardPage() {
  const profile = freelancers[0];
  const profileCompletion = 85;

  return (
    <div className="flex">
      <DashboardSidebar links={sidebarLinks} title="Freelancer Dashboard" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
          <p className="text-muted-foreground">{profile.title}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to get more clients
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="mt-4" />
            <Button variant="outline" size="sm" className="mt-4">
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Earnings (MTD)", value: "$4,250" },
            { label: "Active Jobs", value: "2" },
            { label: "Pending Proposals", value: "1" },
            { label: "Rating", value: "4.9 ★" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section id="earnings" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Earnings Overview</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-primary">$4,250</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold">$3,800</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">All Time</p>
                  <p className="text-2xl font-bold">$89,400</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="jobs" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Active Jobs</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Mobile Fitness App MVP</h3>
                  <p className="text-sm text-muted-foreground">FitLife Co. · Due Jun 30</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(7500)}</p>
                  <Badge variant="warning">In Progress</Badge>
                </div>
              </div>
              <Progress value={45} className="mt-4" />
            </CardContent>
          </Card>
        </section>

        <section id="proposals" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Proposals</h2>
          <div className="space-y-3">
            {proposals.map((prop) => (
              <Card key={prop.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div>
                    <h3 className="font-medium">{prop.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {prop.clientName} · {formatDate(prop.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatCurrency(prop.bidAmount)}</span>
                    <Badge variant={proposalStatus[prop.status]}>{prop.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="reviews" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Recent Reviews</h2>
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">★★★★★ from David Kim</p>
              <p className="mt-2 text-sm text-muted-foreground">
                &ldquo;Marcus delivered an exceptional e-commerce platform ahead of schedule.&rdquo;
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="portfolio" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Portfolio Manager</h2>
            <Button size="sm">Add Project</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.portfolio.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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

        <section id="settings">
          <h2 className="mb-4 text-lg font-semibold">Availability Settings</h2>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available for new projects</Label>
                <Switch id="available" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Email notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <Link href={`/freelancers/${profile.id}`}>
                <Button variant="outline">View Public Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
