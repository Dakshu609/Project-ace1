import { createClient } from "@/database/supabase/server";
import type {
  Contract,
  Conversation,
  FreelancerProfile,
  JobPost,
  Message,
  Payment,
  Project,
  Proposal,
  Review,
  Service,
} from "@/shared/types";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=ProjectAce";

export interface CategoryStat {
  name: string;
  icon: string;
  count: number;
}

export interface FreelancerFilters {
  search?: string;
  category?: string;
  sort?: string;
  skills?: string[];
  availability?: string[];
  minRating?: number;
}

export interface ServiceFilters {
  search?: string;
  category?: string;
}

export interface PlatformCounters {
  totalUsers: number;
  activeProjects: number;
  revenueMonth: number;
  openDisputes: number;
  verifiedFreelancers: number;
}

export interface ClientDashboardData {
  stats: Array<{ label: string; value: string; subtext?: string }>;
  jobs: JobPost[];
  contracts: Contract[];
  payments: Payment[];
  savedFreelancers: FreelancerProfile[];
}

export interface FreelancerDashboardData {
  profile: FreelancerProfile | null;
  profileCompletion: number;
  stats: Array<{ label: string; value: string; subtext?: string }>;
  activeContracts: Contract[];
  proposals: Proposal[];
  reviews: Review[];
}

export interface AdminDashboardData {
  counters: PlatformCounters;
  pendingFreelancers: FreelancerProfile[];
  openProjects: Project[];
  recentActivity: Array<{ action: string; user: string; time: string }>;
}

export interface MessagingData {
  userId: string;
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

function dbError(scope: string, error: unknown) {
  if (error) console.error(`[marketplace:${scope}]`, error);
}

async function db() {
  return (await createClient()) as any;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function profileName(row: any) {
  return row?.display_name || row?.full_name || row?.email?.split("@")[0] || "Project Ace user";
}

export function formatCompactCurrency(amount: number) {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
  return `$${amount.toLocaleString()}`;
}

export async function getCurrentProfile() {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  dbError("current-profile", error);
  return { user, profile };
}

export async function getCategories(): Promise<string[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });

  dbError("categories", error);
  return (data ?? []).map((row: any) => row.name).filter(Boolean);
}

export async function getCategoryStats(limit = 9): Promise<CategoryStat[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("marketplace_category_stats")
    .select("name, icon, freelancer_count")
    .order("freelancer_count", { ascending: false })
    .limit(limit);

  dbError("category-stats", error);
  return (data ?? []).map((row: any) => ({
    name: row.name,
    icon: row.icon ?? "Code2",
    count: toNumber(row.freelancer_count),
  }));
}

function mapFreelancer(row: any): FreelancerProfile {
  return {
    id: row.id,
    userId: row.profile_id,
    name: profileName(row),
    title: row.title ?? "Freelance developer",
    avatar: row.avatar_url ?? DEFAULT_AVATAR,
    bio: row.bio ?? "",
    hourlyRate: toNumber(row.hourly_rate),
    rating: toNumber(row.rating),
    reviewCount: toNumber(row.review_count),
    skills: toStringArray(row.skills),
    categories: toStringArray(row.categories),
    completedJobs: toNumber(row.completed_jobs),
    availability: row.availability ?? "away",
    location: row.location ?? "Remote",
    experience: row.experience_level ?? "mid",
    languages: toStringArray(row.languages),
    responseTime: row.response_time ?? "within 24 hours",
    portfolio: (row.portfolio_items ?? []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      image: item.image_url ?? "",
      tags: toStringArray(item.tags),
      url: item.url ?? undefined,
    })),
  };
}

export async function getFreelancers(filters: FreelancerFilters = {}): Promise<FreelancerProfile[]> {
  const supabase = await db();
  let query = supabase
    .from("freelancer_profiles")
    .select("*, portfolio_items(*)")
    .eq("verification_status", "verified");

  if (filters.search) {
    const q = filters.search.replaceAll(",", " ").trim();
    query = query.or(`display_name.ilike.%${q}%,title.ilike.%${q}%,bio.ilike.%${q}%`);
  }

  if (filters.category) query = query.contains("categories", [filters.category]);
  if (filters.skills?.length) query = query.contains("skills", filters.skills);
  if (filters.availability?.length) query = query.in("availability", filters.availability);
  if (filters.minRating) query = query.gte("rating", filters.minRating);

  switch (filters.sort) {
    case "price-low":
      query = query.order("hourly_rate", { ascending: true });
      break;
    case "price-high":
      query = query.order("hourly_rate", { ascending: false });
      break;
    case "jobs":
      query = query.order("completed_jobs", { ascending: false });
      break;
    default:
      query = query.order("rating", { ascending: false });
  }

  const { data, error } = await query.limit(50);
  dbError("freelancers", error);
  return (data ?? []).map(mapFreelancer);
}

export async function getFeaturedFreelancers(limit = 4) {
  const freelancers = await getFreelancers({ sort: "rating" });
  return freelancers.slice(0, limit);
}

export async function getFreelancerById(id: string): Promise<FreelancerProfile | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("freelancer_profiles")
    .select("*, portfolio_items(*)")
    .eq("id", id)
    .single();

  dbError("freelancer", error);
  return data ? mapFreelancer(data) : null;
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    freelancerId: row.freelancer_profile_id,
    clientName: row.client_name ?? "Client",
    clientAvatar: row.client_avatar_url ?? DEFAULT_AVATAR,
    rating: toNumber(row.rating),
    comment: row.comment ?? "",
    projectTitle: row.project_title ?? "Project",
    createdAt: row.created_at,
  };
}

export async function getReviewsByFreelancerId(freelancerId: string): Promise<Review[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("freelancer_profile_id", freelancerId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  dbError("reviews", error);
  return (data ?? []).map(mapReview);
}

function mapService(row: any): Service {
  return {
    id: row.id,
    freelancerId: row.freelancer_profile_id,
    freelancerName: row.freelancer_name ?? row.freelancer_profiles?.display_name ?? "Freelancer",
    freelancerAvatar: row.freelancer_avatar_url ?? row.freelancer_profiles?.avatar_url ?? DEFAULT_AVATAR,
    title: row.title,
    description: row.description ?? "",
    category: row.category_name ?? "General",
    price: toNumber(row.price),
    deliveryDays: toNumber(row.delivery_days),
    rating: toNumber(row.rating),
    reviewCount: toNumber(row.review_count),
    image: row.image_url ?? "",
    tags: toStringArray(row.tags),
  };
}

export async function getServices(filters: ServiceFilters = {}): Promise<Service[]> {
  const supabase = await db();
  let query = supabase
    .from("services")
    .select("*, freelancer_profiles(display_name, avatar_url)")
    .eq("status", "active");

  if (filters.search) {
    const q = filters.search.trim();
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (filters.category && filters.category !== "all") query = query.eq("category_name", filters.category);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(60);
  dbError("services", error);
  return (data ?? []).map(mapService);
}

function mapProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    clientName: row.client_name ?? "Client",
    budget: toNumber(row.budget_amount),
    status: row.status === "active" ? "in_progress" : row.status ?? "open",
    category: row.category_name ?? "General",
    postedAt: row.created_at,
    skills: toStringArray(row.skills),
    proposals: toNumber(row.proposal_count),
  };
}

function mapJobPost(row: any): JobPost {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    budget: toNumber(row.budget_amount),
    budgetType: row.budget_type ?? "fixed",
    category: row.category_name ?? "General",
    skills: toStringArray(row.skills),
    status: row.status ?? "open",
    clientId: row.client_id,
    proposals: toNumber(row.proposal_count),
    postedAt: row.created_at,
    deadline: row.deadline ?? undefined,
  };
}

export async function getRecentProjects(limit = 4): Promise<Project[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("job_posts")
    .select("*")
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(limit);

  dbError("recent-projects", error);
  return (data ?? []).map(mapProject);
}

function mapContract(row: any): Contract {
  return {
    id: row.id,
    projectTitle: row.project_title ?? "Project",
    freelancerName: row.freelancer_name ?? "Freelancer",
    freelancerAvatar: row.freelancer_avatar_url ?? DEFAULT_AVATAR,
    amount: toNumber(row.amount),
    status: row.status ?? "pending",
    progress: toNumber(row.progress),
    dueDate: row.due_date ?? row.created_at,
  };
}

function mapPayment(row: any): Payment {
  return {
    id: row.id,
    projectTitle: row.project_title ?? "Project",
    amount: toNumber(row.amount),
    status: row.status ?? "pending",
    date: row.created_at,
    freelancerName: row.freelancer_name ?? "Freelancer",
  };
}

function mapProposal(row: any): Proposal {
  return {
    id: row.id,
    jobTitle: row.job_title ?? "Job",
    clientName: row.client_name ?? "Client",
    bidAmount: toNumber(row.bid_amount),
    status: row.status ?? "pending",
    submittedAt: row.created_at,
  };
}

export async function getClientDashboard(): Promise<ClientDashboardData> {
  const { user } = await getCurrentProfile();
  if (!user) return { stats: [], jobs: [], contracts: [], payments: [], savedFreelancers: [] };

  const supabase = await db();
  const [jobsResult, contractsResult, paymentsResult, savedResult] = await Promise.all([
    supabase.from("job_posts").select("*").eq("client_id", user.id).order("created_at", { ascending: false }),
    supabase.from("contracts").select("*").eq("client_id", user.id).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("client_id", user.id).order("created_at", { ascending: false }),
    supabase.from("saved_freelancers").select("freelancer_profiles(*, portfolio_items(*))").eq("client_id", user.id).limit(3),
  ]);

  dbError("client-jobs", jobsResult.error);
  dbError("client-contracts", contractsResult.error);
  dbError("client-payments", paymentsResult.error);
  dbError("client-saved", savedResult.error);

  const jobs = (jobsResult.data ?? []).map(mapJobPost);
  const contracts = (contractsResult.data ?? []).map(mapContract);
  const payments = (paymentsResult.data ?? []).map(mapPayment);
  const savedFreelancers = (savedResult.data ?? [])
    .map((row: any) => row.freelancer_profiles)
    .filter(Boolean)
    .map(mapFreelancer);
  const totalSpent = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    jobs,
    contracts,
    payments,
    savedFreelancers,
    stats: [
      { label: "Active Contracts", value: contracts.filter((item) => item.status === "active").length.toString() },
      { label: "Open Jobs", value: jobs.filter((item) => item.status === "open").length.toString() },
      { label: "Total Spent", value: formatCompactCurrency(totalSpent), subtext: "Completed payments" },
      { label: "Saved Freelancers", value: savedFreelancers.length.toString() },
    ],
  };
}

export async function getFreelancerDashboard(): Promise<FreelancerDashboardData> {
  const { user } = await getCurrentProfile();
  if (!user) {
    return { profile: null, profileCompletion: 0, stats: [], activeContracts: [], proposals: [], reviews: [] };
  }

  const profile = await getFreelancerProfileForUser(user.id);
  if (!profile) {
    return { profile: null, profileCompletion: 0, stats: [], activeContracts: [], proposals: [], reviews: [] };
  }

  const supabase = await db();
  const [contractsResult, proposalsResult, reviewsResult, paymentsResult] = await Promise.all([
    supabase.from("contracts").select("*").eq("freelancer_profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("proposals").select("*").eq("freelancer_profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").eq("freelancer_profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("freelancer_profile_id", profile.id).eq("status", "completed"),
  ]);

  dbError("freelancer-contracts", contractsResult.error);
  dbError("freelancer-proposals", proposalsResult.error);
  dbError("freelancer-reviews", reviewsResult.error);
  dbError("freelancer-payments", paymentsResult.error);

  const activeContracts = (contractsResult.data ?? []).map(mapContract);
  const proposals = (proposalsResult.data ?? []).map(mapProposal);
  const reviews = (reviewsResult.data ?? []).map(mapReview);
  const earnings = (paymentsResult.data ?? []).reduce((sum: number, row: any) => sum + toNumber(row.amount), 0);
  const completionFields = [
    profile.name,
    profile.title,
    profile.bio,
    profile.hourlyRate,
    profile.skills.length,
    profile.categories.length,
    profile.location,
    profile.languages.length,
  ];
  const profileCompletion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return {
    profile,
    profileCompletion,
    activeContracts,
    proposals,
    reviews,
    stats: [
      { label: "Earnings", value: formatCompactCurrency(earnings), subtext: "Completed payments" },
      { label: "Active Jobs", value: activeContracts.filter((item) => item.status === "active").length.toString() },
      { label: "Pending Proposals", value: proposals.filter((item) => item.status === "pending").length.toString() },
      { label: "Rating", value: profile.rating ? profile.rating.toFixed(1) : "New" },
    ],
  };
}

async function getFreelancerProfileForUser(userId: string): Promise<FreelancerProfile | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("freelancer_profiles")
    .select("*, portfolio_items(*)")
    .eq("profile_id", userId)
    .maybeSingle();

  dbError("freelancer-by-user", error);
  return data ? mapFreelancer(data) : null;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const supabase = await db();
  const [countersResult, pendingResult, projectsResult, activityResult] = await Promise.all([
    supabase.from("platform_counters").select("*").maybeSingle(),
    supabase.from("freelancer_profiles").select("*, portfolio_items(*)").eq("verification_status", "pending").limit(6),
    supabase.from("job_posts").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(6),
    supabase.from("admin_events").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  dbError("admin-counters", countersResult.error);
  dbError("admin-pending", pendingResult.error);
  dbError("admin-projects", projectsResult.error);
  dbError("admin-events", activityResult.error);

  const counters = countersResult.data ?? {};
  return {
    counters: {
      totalUsers: toNumber(counters.total_users),
      activeProjects: toNumber(counters.active_projects),
      revenueMonth: toNumber(counters.revenue_month),
      openDisputes: toNumber(counters.open_disputes),
      verifiedFreelancers: toNumber(counters.verified_freelancers),
    },
    pendingFreelancers: (pendingResult.data ?? []).map(mapFreelancer),
    openProjects: (projectsResult.data ?? []).map(mapProject),
    recentActivity: (activityResult.data ?? []).map((row: any) => ({
      action: row.action,
      user: row.actor_label ?? "System",
      time: row.created_at,
    })),
  };
}

export async function getMessagingData(): Promise<MessagingData> {
  const { user } = await getCurrentProfile();
  if (!user) return { userId: "", conversations: [], messagesByConversation: {} };

  const supabase = await db();
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`client_id.eq.${user.id},freelancer_user_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  dbError("conversations", error);
  const conversationRows = conversations ?? [];
  const conversationIds = conversationRows.map((row: any) => row.id);
  const messagesByConversation: Record<string, Message[]> = {};

  if (conversationIds.length) {
    const { data: messages, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true });

    dbError("messages", messageError);
    for (const row of messages ?? []) {
      const message = mapMessage(row);
      messagesByConversation[message.conversationId] ??= [];
      messagesByConversation[message.conversationId].push(message);
    }
  }

  return {
    userId: user.id,
    conversations: conversationRows.map((row: any) => ({
      id: row.id,
      participantId: row.client_id === user.id ? row.freelancer_user_id : row.client_id,
      participantName: row.participant_name ?? "Conversation",
      participantAvatar: row.participant_avatar_url ?? DEFAULT_AVATAR,
      lastMessage: row.last_message ?? "",
      lastMessageAt: row.updated_at,
      unread: toNumber(row.unread_count),
      online: false,
    })),
    messagesByConversation,
  };
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    senderName: row.sender_name ?? "User",
    senderAvatar: row.sender_avatar_url ?? DEFAULT_AVATAR,
    content: row.body,
    timestamp: row.created_at,
    read: Boolean(row.read_at),
  };
}
