export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          name: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          icon?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      freelancer_profiles: {
        Row: {
          id: string;
          profile_id: string;
          display_name: string;
          title: string | null;
          avatar_url: string | null;
          bio: string | null;
          hourly_rate: number;
          rating: number;
          review_count: number;
          skills: string[];
          categories: string[];
          completed_jobs: number;
          availability: Database["public"]["Enums"]["availability"];
          location: string;
          experience_level: Database["public"]["Enums"]["experience_level"];
          languages: string[];
          response_time: string;
          verification_status: Database["public"]["Enums"]["verification_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          display_name: string;
          title?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          hourly_rate?: number;
          rating?: number;
          review_count?: number;
          skills?: string[];
          categories?: string[];
          completed_jobs?: number;
          availability?: Database["public"]["Enums"]["availability"];
          location?: string;
          experience_level?: Database["public"]["Enums"]["experience_level"];
          languages?: string[];
          response_time?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          display_name?: string;
          title?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          hourly_rate?: number;
          rating?: number;
          review_count?: number;
          skills?: string[];
          categories?: string[];
          completed_jobs?: number;
          availability?: Database["public"]["Enums"]["availability"];
          location?: string;
          experience_level?: Database["public"]["Enums"]["experience_level"];
          languages?: string[];
          response_time?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      portfolio_items: {
        Row: {
          id: string;
          freelancer_profile_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          tags: string[];
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          freelancer_profile_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          tags?: string[];
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          freelancer_profile_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          tags?: string[];
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_items_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: {
          id: string;
          freelancer_profile_id: string;
          freelancer_name: string | null;
          freelancer_avatar_url: string | null;
          title: string;
          description: string | null;
          category_name: string | null;
          price: number;
          delivery_days: number;
          rating: number;
          review_count: number;
          image_url: string | null;
          tags: string[];
          status: Database["public"]["Enums"]["service_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          freelancer_profile_id: string;
          freelancer_name?: string | null;
          freelancer_avatar_url?: string | null;
          title: string;
          description?: string | null;
          category_name?: string | null;
          price?: number;
          delivery_days?: number;
          rating?: number;
          review_count?: number;
          image_url?: string | null;
          tags?: string[];
          status?: Database["public"]["Enums"]["service_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          freelancer_profile_id?: string;
          freelancer_name?: string | null;
          freelancer_avatar_url?: string | null;
          title?: string;
          description?: string | null;
          category_name?: string | null;
          price?: number;
          delivery_days?: number;
          rating?: number;
          review_count?: number;
          image_url?: string | null;
          tags?: string[];
          status?: Database["public"]["Enums"]["service_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "services_category_name_fkey";
            columns: ["category_name"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["name"];
          }
        ];
      };
      job_posts: {
        Row: {
          id: string;
          client_id: string;
          client_name: string | null;
          title: string;
          description: string | null;
          category_name: string | null;
          budget_amount: number;
          budget_type: Database["public"]["Enums"]["budget_type"];
          skills: string[];
          status: Database["public"]["Enums"]["job_status"];
          proposal_count: number;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          client_name?: string | null;
          title: string;
          description?: string | null;
          category_name?: string | null;
          budget_amount?: number;
          budget_type?: Database["public"]["Enums"]["budget_type"];
          skills?: string[];
          status?: Database["public"]["Enums"]["job_status"];
          proposal_count?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          client_name?: string | null;
          title?: string;
          description?: string | null;
          category_name?: string | null;
          budget_amount?: number;
          budget_type?: Database["public"]["Enums"]["budget_type"];
          skills?: string[];
          status?: Database["public"]["Enums"]["job_status"];
          proposal_count?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_posts_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_posts_category_name_fkey";
            columns: ["category_name"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["name"];
          }
        ];
      };
      proposals: {
        Row: {
          id: string;
          job_post_id: string;
          freelancer_profile_id: string;
          job_title: string | null;
          client_name: string | null;
          bid_amount: number;
          cover_letter: string | null;
          status: Database["public"]["Enums"]["proposal_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_post_id: string;
          freelancer_profile_id: string;
          job_title?: string | null;
          client_name?: string | null;
          bid_amount?: number;
          cover_letter?: string | null;
          status?: Database["public"]["Enums"]["proposal_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_post_id?: string;
          freelancer_profile_id?: string;
          job_title?: string | null;
          client_name?: string | null;
          bid_amount?: number;
          cover_letter?: string | null;
          status?: Database["public"]["Enums"]["proposal_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_job_post_id_fkey";
            columns: ["job_post_id"];
            isOneToOne: false;
            referencedRelation: "job_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proposals_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      contracts: {
        Row: {
          id: string;
          job_post_id: string | null;
          client_id: string;
          freelancer_profile_id: string;
          project_title: string | null;
          freelancer_name: string | null;
          freelancer_avatar_url: string | null;
          amount: number;
          status: Database["public"]["Enums"]["contract_status"];
          progress: number;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_post_id?: string | null;
          client_id: string;
          freelancer_profile_id: string;
          project_title?: string | null;
          freelancer_name?: string | null;
          freelancer_avatar_url?: string | null;
          amount?: number;
          status?: Database["public"]["Enums"]["contract_status"];
          progress?: number;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_post_id?: string | null;
          client_id?: string;
          freelancer_profile_id?: string;
          project_title?: string | null;
          freelancer_name?: string | null;
          freelancer_avatar_url?: string | null;
          amount?: number;
          status?: Database["public"]["Enums"]["contract_status"];
          progress?: number;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contracts_job_post_id_fkey";
            columns: ["job_post_id"];
            isOneToOne: false;
            referencedRelation: "job_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          contract_id: string | null;
          client_id: string;
          freelancer_profile_id: string;
          project_title: string | null;
          freelancer_name: string | null;
          amount: number;
          status: Database["public"]["Enums"]["payment_status"];
          provider: string | null;
          provider_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id?: string | null;
          client_id: string;
          freelancer_profile_id: string;
          project_title?: string | null;
          freelancer_name?: string | null;
          amount?: number;
          status?: Database["public"]["Enums"]["payment_status"];
          provider?: string | null;
          provider_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string | null;
          client_id?: string;
          freelancer_profile_id?: string;
          project_title?: string | null;
          freelancer_name?: string | null;
          amount?: number;
          status?: Database["public"]["Enums"]["payment_status"];
          provider?: string | null;
          provider_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          id: string;
          contract_id: string | null;
          freelancer_profile_id: string;
          client_id: string | null;
          client_name: string | null;
          client_avatar_url: string | null;
          project_title: string | null;
          rating: number;
          comment: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id?: string | null;
          freelancer_profile_id: string;
          client_id?: string | null;
          client_name?: string | null;
          client_avatar_url?: string | null;
          project_title?: string | null;
          rating: number;
          comment?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string | null;
          freelancer_profile_id?: string;
          client_id?: string | null;
          client_name?: string | null;
          client_avatar_url?: string | null;
          project_title?: string | null;
          rating?: number;
          comment?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_freelancers: {
        Row: {
          client_id: string;
          freelancer_profile_id: string;
          created_at: string;
        };
        Insert: {
          client_id: string;
          freelancer_profile_id: string;
          created_at?: string;
        };
        Update: {
          client_id?: string;
          freelancer_profile_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_freelancers_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_freelancers_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          freelancer_profile_id: string | null;
          freelancer_user_id: string | null;
          participant_name: string | null;
          participant_avatar_url: string | null;
          last_message: string;
          unread_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          freelancer_profile_id?: string | null;
          freelancer_user_id?: string | null;
          participant_name?: string | null;
          participant_avatar_url?: string | null;
          last_message?: string;
          unread_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          freelancer_profile_id?: string | null;
          freelancer_user_id?: string | null;
          participant_name?: string | null;
          participant_avatar_url?: string | null;
          last_message?: string;
          unread_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_freelancer_profile_id_fkey";
            columns: ["freelancer_profile_id"];
            isOneToOne: false;
            referencedRelation: "freelancer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_freelancer_user_id_fkey";
            columns: ["freelancer_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          sender_name: string | null;
          sender_avatar_url: string | null;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          sender_name?: string | null;
          sender_avatar_url?: string | null;
          body: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          sender_name?: string | null;
          sender_avatar_url?: string | null;
          body?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_events: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_label: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_label?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_label?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      marketplace_category_stats: {
        Row: {
          name: string | null;
          icon: string | null;
          freelancer_count: number | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      platform_counters: {
        Row: {
          total_users: number | null;
          active_projects: number | null;
          revenue_month: number | null;
          open_disputes: number | null;
          verified_freelancers: number | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "client" | "freelancer" | "admin";
      availability: "available" | "busy" | "away";
      experience_level: "junior" | "mid" | "senior" | "expert";
      verification_status: "pending" | "verified" | "rejected";
      service_status: "draft" | "active" | "paused" | "archived";
      budget_type: "fixed" | "hourly";
      job_status: "draft" | "open" | "active" | "completed" | "cancelled";
      proposal_status: "pending" | "accepted" | "rejected" | "withdrawn";
      contract_status: "pending" | "active" | "completed" | "cancelled" | "disputed";
      payment_status: "pending" | "escrow" | "completed" | "refunded" | "failed";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type FreelancerProfileRow = Database["public"]["Tables"]["freelancer_profiles"]["Row"];
export type PortfolioItemRow = Database["public"]["Tables"]["portfolio_items"]["Row"];
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type JobPostRow = Database["public"]["Tables"]["job_posts"]["Row"];
export type ProposalRow = Database["public"]["Tables"]["proposals"]["Row"];
export type ContractRow = Database["public"]["Tables"]["contracts"]["Row"];
export type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type AdminEventRow = Database["public"]["Tables"]["admin_events"]["Row"];
