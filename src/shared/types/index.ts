export type UserRole = "client" | "freelancer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  joinedAt: string;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  skills: string[];
  categories: string[];
  completedJobs: number;
  availability: "available" | "busy" | "away";
  location: string;
  experience: "junior" | "mid" | "senior" | "expert";
  portfolio: PortfolioItem[];
  languages: string[];
  responseTime: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
}

export interface Service {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  budget: number;
  status: "open" | "in_progress" | "completed";
  category: string;
  postedAt: string;
  skills: string[];
  proposals: number;
}

export interface Review {
  id: string;
  freelancerId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  projectTitle: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  online: boolean;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  category: string;
  skills: string[];
  status: "open" | "active" | "completed" | "draft";
  clientId: string;
  proposals: number;
  postedAt: string;
  deadline?: string;
}

export interface Payment {
  id: string;
  projectTitle: string;
  amount: number;
  status: "completed" | "pending" | "escrow";
  date: string;
  freelancerName: string;
}

export interface Contract {
  id: string;
  projectTitle: string;
  freelancerName: string;
  freelancerAvatar: string;
  amount: number;
  status: "active" | "completed" | "pending";
  progress: number;
  dueDate: string;
}

export interface Proposal {
  id: string;
  jobTitle: string;
  clientName: string;
  bidAmount: number;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}
