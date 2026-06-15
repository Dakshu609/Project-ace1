"use server";

import { createClient } from "@/server/lib/supabase";
import { cache } from "react";

export interface FreelancerFilters {
  search?: string;
  category?: string;
  skills?: string[];
  availability?: string[];
  minRating?: number;
  sort?: string;
}

export interface ServiceFilters {
  search?: string;
  category?: string;
}

/**
 * Get all categories with stats
 */
export const getCategories = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
});

/**
 * Get category statistics (with freelancer counts)
 */
export const getCategoryStats = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketplace_category_stats")
    .select("*")
    .order("freelancer_count", { ascending: false });
  return data || [];
});

/**
 * Get platform counters for homepage/admin
 */
export const getPlatformCounters = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("platform_counters").select("*").single();
  return data || {
    total_users: 0,
    active_projects: 0,
    revenue_month: 0,
    open_disputes: 0,
    verified_freelancers: 0,
  };
});

/**
 * Search and filter freelancers
 */
export async function getFreelancers(filters: FreelancerFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("freelancer_profiles")
    .select("*")
    .eq("verification_status", "verified");

  // Search by name, title, or skills
  if (filters.search) {
    query = query.or(
      `display_name.ilike.%${filters.search}%,title.ilike.%${filters.search}%,skills.cs.{${filters.search}}`
    );
  }

  // Filter by category
  if (filters.category) {
    query = query.contains("categories", [filters.category]);
  }

  // Filter by skills
  if (filters.skills && filters.skills.length > 0) {
    query = query.overlaps("skills", filters.skills);
  }

  // Filter by availability
  if (filters.availability && filters.availability.length > 0) {
    query = query.in("availability", filters.availability);
  }

  // Filter by minimum rating
  if (filters.minRating) {
    query = query.gte("rating", filters.minRating);
  }

  // Sorting
  switch (filters.sort) {
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "price_low":
      query = query.order("hourly_rate", { ascending: true });
      break;
    case "price_high":
      query = query.order("hourly_rate", { ascending: false });
      break;
    default:
      query = query.order("review_count", { ascending: false });
  }

  const { data, error } = await query;
  return data || [];
}

/**
 * Get featured/top freelancers for homepage
 */
export const getFeaturedFreelancers = cache(async (limit = 6) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("freelancer_profiles")
    .select("*")
    .eq("verification_status", "verified")
    .gte("rating", 4.7)
    .order("review_count", { ascending: false })
    .limit(limit);
  return data || [];
});

/**
 * Get freelancer by ID with portfolio
 */
export async function getFreelancerById(id: string) {
  const supabase = await createClient();

  const { data: freelancer } = await supabase
    .from("freelancer_profiles")
    .select("*, portfolio_items(*)")
    .eq("id", id)
    .single();

  return freelancer;
}

/**
 * Get freelancer reviews
 */
export async function getFreelancerReviews(freelancerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("freelancer_profile_id", freelancerId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  return data || [];
}

/**
 * Search services
 */
export async function getServices(filters: ServiceFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select("*")
    .eq("status", "active");

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters.category) {
    query = query.eq("category_name", filters.category);
  }

  query = query.order("rating", { ascending: false });

  const { data } = await query;
  return data || [];
}

/**
 * Get recent projects for homepage
 */
export const getRecentProjects = cache(async (limit = 6) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_posts")
    .select("*")
    .in("status", ["open", "active"])
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
});

/**
 * Get client dashboard data
 */
export async function getClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [jobPosts, contracts, payments, savedFreelancers] = await Promise.all([
    supabase
      .from("job_posts")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("*")
      .eq("client_id", user.id)
      .in("status", ["active", "pending"])
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("saved_freelancers")
      .select("*, freelancer_profiles(*)")
      .eq("client_id", user.id)
      .limit(5),
  ]);

  return {
    jobs: jobPosts.data || [],
    contracts: contracts.data || [],
    payments: payments.data || [],
    savedFreelancers:
      savedFreelancers.data?.map((sf: any) => sf.freelancer_profiles) || [],
    stats: {
      activeJobs: jobPosts.data?.filter((j) => j.status === "open").length || 0,
      activeContracts: contracts.data?.length || 0,
      totalSpent:
        payments.data
          ?.filter((p) => p.status === "completed")
          .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0,
    },
  };
}

/**
 * Get freelancer dashboard data
 */
export async function getFreelancerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get freelancer profile
  const { data: profile } = await supabase
    .from("freelancer_profiles")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!profile) return null;

  const [proposals, contracts, payments] = await Promise.all([
    supabase
      .from("proposals")
      .select("*")
      .eq("freelancer_profile_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("*")
      .eq("freelancer_profile_id", profile.id)
      .in("status", ["active", "pending"])
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("freelancer_profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    profile,
    proposals: proposals.data || [],
    contracts: contracts.data || [],
    payments: payments.data || [],
    stats: {
      activeProposals:
        proposals.data?.filter((p) => p.status === "pending").length || 0,
      activeContracts: contracts.data?.length || 0,
      totalEarned:
        payments.data
          ?.filter((p) => p.status === "completed")
          .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0,
      profileCompleteness: calculateProfileCompleteness(profile),
    },
  };
}

/**
 * Get admin dashboard data
 */
export async function getAdminDashboard() {
  const supabase = await createClient();

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;

  const [counters, pendingFreelancers, recentActivity] = await Promise.all([
    supabase.from("platform_counters").select("*").single(),
    supabase
      .from("freelancer_profiles")
      .select("*")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("admin_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    counters: counters.data,
    pendingFreelancers: pendingFreelancers.data || [],
    recentActivity: recentActivity.data || [],
  };
}

/**
 * Calculate profile completeness percentage
 */
function calculateProfileCompleteness(profile: any): number {
  const fields = [
    profile.display_name,
    profile.title,
    profile.bio,
    profile.hourly_rate > 0,
    profile.skills?.length > 0,
    profile.categories?.length > 0,
    profile.location,
    profile.experience_level,
    profile.avatar_url,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}
