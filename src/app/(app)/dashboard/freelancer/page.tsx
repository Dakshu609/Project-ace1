import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Progress } from "@/client/components/ui/progress";
import { Switch } from "@/client/components/ui/switch";
import { Label } from "@/client/components/ui/label";
import { DashboardLayout } from "@/client/components/dashboard/dashboard-layout";
import { DashboardSection } from "@/client/components/dashboard/dashboard-section";
import { StatCard } from "@/client/components/dashboard/stat-card";
import { PageHeader } from "@/client/components/shared/page-header";
import { getProfile } from "@/server/auth/actions";
import { formatCurrency, formatDate } from "@/shared/utils";
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

export default async function FreelancerDashboardPage() {
  const userProfile = await getProfile();
  const mockProfile = freelancers[0];
  const displayName =
    userProfile?.full_name || userProfile?.email?.split("@")[0] || mockProfile.name;
  const profileCompletion = 85;

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} sidebarTitle="Freelancer Dashboard">
      <PageHeader title={`Welcome, ${displayName}`} description={mockProfile.title} />

      <Card className="page-header-gap">
        <CardContent className="p-5 sm:p-6">
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

      <div className="page-header-gap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Earnings (MTD)", value: "$4,250" },
          { label: "Active Jobs", value: "2" },
          { label: "Pending Proposals", value: "1" },
          { label: "Rating", value: "4.9 ★" },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <DashboardSection id="earnings" title="Earnings Overview">
        <Card>
          <CardContent className="p-5 sm:p-6">
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
      </DashboardSection>

      <DashboardSection id="jobs" title="Active Jobs">
        <Card>
          <CardContent className="p-4 sm:p-5">
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
      </DashboardSection>

      <DashboardSection id="proposals" title="Proposals">
        <div className="space-y-3">
          {proposals.map((prop) => (
            <Card key={prop.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
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
      </DashboardSection>

      <DashboardSection id="reviews" title="Recent Reviews">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="font-medium">★★★★★ from David Kim</p>
            <p className="mt-2 text-sm text-muted-foreground">
              &ldquo;Marcus delivered an exceptional e-commerce platform ahead of schedule.&rdquo;
            </p>
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection
        id="portfolio"
        title="Portfolio Manager"
        action={<Button size="sm">Add Project</Button>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {mockProfile.portfolio.map((item) => (
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
      </DashboardSection>

      <DashboardSection id="settings" title="Availability Settings">
        <Card>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="available">Available for new projects</Label>
              <Switch id="available" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Email notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <Link href={`/freelancers/${mockProfile.id}`}>
              <Button variant="outline">View Public Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardSection>
    </DashboardLayout>
  );
}
