import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { StatCard } from "@/client/components/dashboard/stat-card";
import { PageHeader } from "@/client/components/shared/page-header";
import { formatCurrency } from "@/shared/utils";
import { freelancers, projects, users } from "@/lib/data/mock";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "12,450", icon: Users, change: "+12%" },
    { label: "Active Projects", value: "342", icon: Briefcase, change: "+8%" },
    { label: "Revenue (MTD)", value: "$284k", icon: DollarSign, change: "+24%" },
    { label: "Disputes", value: "7", icon: AlertTriangle, change: "-3%" },
  ];

  const recentActivity = [
    { action: "New freelancer verified", user: "James Okonkwo", time: "2 min ago" },
    { action: "Job posted", user: "TechFlow Inc.", time: "15 min ago" },
    { action: "Payment released", user: "$2,500 to Marcus J.", time: "1 hr ago" },
    { action: "Dispute opened", user: "Project #4521", time: "3 hrs ago" },
    { action: "User reported", user: "Spam profile", time: "5 hrs ago" },
  ];

  return (
    <div className="container mx-auto max-w-6xl page-padding">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Dashboard
          </span>
        }
        description="Platform overview and management"
        actions={<Badge variant="secondary">Super Admin</Badge>}
      />

      <div className="page-header-gap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={
              <span className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            }
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Verifications</CardTitle>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {freelancers.slice(0, 4).map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{f.title}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length + freelancers.length}</p>
            <p className="text-sm text-muted-foreground">Registered accounts (sample)</p>
            <div className="mt-4 space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between text-sm">
                  <span>{u.name}</span>
                  <Badge variant="outline">{u.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects
              .filter((p) => p.status === "open")
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.clientName}</p>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(p.budget)}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
