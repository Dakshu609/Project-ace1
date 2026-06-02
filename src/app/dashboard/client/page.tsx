import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { jobPosts, contracts, payments, freelancers } from "@/lib/data/mock";

const sidebarLinks = [
  { href: "/dashboard/client", label: "Overview", icon: "LayoutDashboard" as const },
  { href: "/dashboard/client#jobs", label: "Posted Jobs", icon: "FileText" as const },
  { href: "/dashboard/client#contracts", label: "Contracts", icon: "Briefcase" as const },
  { href: "/dashboard/client#payments", label: "Payments", icon: "CreditCard" as const },
  { href: "/dashboard/client#saved", label: "Saved", icon: "Heart" as const },
  { href: "/messages", label: "Messages", icon: "MessageSquare" as const },
];

const statusColors = {
  open: "success",
  active: "warning",
  completed: "secondary",
  draft: "outline",
} as const;

export default function ClientDashboardPage() {
  const savedFreelancers = freelancers.slice(0, 3);

  return (
    <div className="flex">
      <DashboardSidebar links={sidebarLinks} title="Client Dashboard" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Sarah</h1>
            <p className="text-muted-foreground">Manage your projects and hires</p>
          </div>
          <Link href="/post-job">
            <Button>Post New Job</Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Contracts", value: "2", change: "+1 this month" },
            { label: "Open Jobs", value: "1", change: "3 proposals avg" },
            { label: "Total Spent", value: "$12.4k", change: "All time" },
            { label: "Saved Freelancers", value: "3", change: "Ready to hire" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section id="jobs" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Posted Jobs</h2>
          <div className="space-y-4">
            {jobPosts.map((job) => (
              <Card key={job.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(job.budget)} · {job.proposals} proposals ·{" "}
                      {formatDate(job.postedAt)}
                    </p>
                  </div>
                  <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contracts" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Active Contracts</h2>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={contract.freelancerAvatar}
                          alt={contract.freelancerName}
                          fill
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{contract.projectTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contract.freelancerName} · Due {formatDate(contract.dueDate)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">{formatCurrency(contract.amount)}</span>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{contract.progress}%</span>
                    </div>
                    <Progress value={contract.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="payments" className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Payments</h2>
          <Card>
            <CardContent className="divide-y p-0">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium">{payment.projectTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.freelancerName} · {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "success"
                          : payment.status === "escrow"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="saved">
          <h2 className="mb-4 text-lg font-semibold">Saved Freelancers</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {savedFreelancers.map((f) => (
              <Card key={f.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={f.avatar} alt={f.name} fill unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{f.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{f.title}</p>
                  </div>
                  <Link href={`/freelancers/${f.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
