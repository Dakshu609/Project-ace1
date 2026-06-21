import { AlertCircle } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { PageHeader } from "@/client/components/shared/page-header";
import { asString } from "@/shared/utils";
import { createJobPost } from "@/server/marketplace/actions";
import { getCategories } from "@/server/marketplace/queries";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PostJobPage({ searchParams }: PageProps) {
  const [categories, params] = await Promise.all([getCategories(), searchParams]);
  const error = asString(params.error);

  return (
    <div className="container mx-auto max-w-2xl page-padding">
      <PageHeader
        title="Post a Job"
        description="Describe your project and receive proposals from verified freelancers"
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error === "invalid_job"
            ? "Please complete the required fields with a valid budget."
            : "The job could not be saved. Confirm the database schema is applied and try again."}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createJobPost} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. React Dashboard for Analytics Platform"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project requirements, goals, and deliverables..."
                rows={5}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetType">Budget Type</Label>
                <select
                  id="budgetType"
                  name="budgetType"
                  defaultValue="fixed"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input id="budget" name="budget" type="number" min="1" placeholder="5000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="React, TypeScript, Node.js (comma separated)"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
