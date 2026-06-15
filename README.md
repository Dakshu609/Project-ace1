# Project Ace - Freelance Marketplace Platform

![Project Ace](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

A modern, production-ready freelance coding marketplace connecting clients with verified developers. Built with Next.js 16, React 19, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- ✅ **Authentication & Authorization**
  - Email/Password signup and login
  - Google OAuth integration
  - Role-based access control (Client, Freelancer, Admin)
  - Protected routes with middleware
  - Secure session management

- ✅ **Freelancer Marketplace**
  - Browse verified freelancers with advanced filters
  - Search by skills, category, rating, price
  - Detailed freelancer profiles with portfolio
  - Reviews and ratings system
  - Save favorite freelancers

- ✅ **Job & Project Management**
  - Post jobs (fixed/hourly budget)
  - Browse open projects
  - Submit and manage proposals
  - Contract tracking with progress indicators
  - Job status workflow (draft → open → active → completed)

- ✅ **Services Marketplace**
  - Fixed-price service listings
  - Category-based browsing
  - Service ratings and reviews

- ✅ **Real-time Messaging**
  - Supabase Realtime integration
  - Conversation threads
  - Read/unread status
  - Email notifications for new messages
  - Online/offline indicators

- ✅ **Payment Processing**
  - Stripe integration
  - Escrow protection system
  - Payment intent creation
  - Webhook handling
  - Transaction history
  - Payment status tracking

- ✅ **File Uploads**
  - Supabase Storage integration
  - Avatar uploads
  - Portfolio image uploads
  - Service image uploads
  - Image optimization
  - Size validation

- ✅ **Email Notifications**
  - Welcome emails
  - New message notifications
  - Proposal accepted notifications
  - Payment released notifications
  - Resend API integration

- ✅ **Admin Dashboard**
  - Platform statistics
  - Freelancer verification workflow
  - Activity logs
  - User management
  - Dispute monitoring

- ✅ **UI/UX**
  - Dark/Light mode
  - Responsive mobile-first design
  - Animated components (Framer Motion)
  - Accessible (WCAG compliant via Radix UI)
  - Loading states and error boundaries

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2.6** - App Router with React Server Components
- **React 19.2.4** - Latest React features
- **TypeScript 5** - Type safety throughout
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Radix UI primitives with Tailwind
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Backend
- **Next.js Server Actions** - Server-side mutations
- **Supabase** - PostgreSQL database + Auth + Storage + Realtime
- **Stripe** - Payment processing
- **Resend** - Email service

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

## 📁 Project Structure

```
project-ace/
├── client/                      # Client-side code (Frontend)
│   ├── components/              # React components
│   │   ├── auth/                # Authentication UI
│   │   ├── dashboard/           # Dashboard components
│   │   ├── freelancers/         # Freelancer cards & filters
│   │   ├── home/                # Homepage sections
│   │   ├── layout/              # Navbar, footer, theme
│   │   ├── providers/           # Context providers
│   │   ├── shared/              # Reusable components
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-realtime-conversations.ts
│   │   └── use-realtime-messages.ts
│   └── lib/                     # Client utilities
│       ├── supabase.ts          # Browser Supabase client
│       └── stripe.ts            # Stripe client
│
├── server/                      # Server-side code (Backend)
│   ├── config/                  # Configuration
│   │   ├── stripe.ts            # Stripe setup
│   │   └── email.ts             # Email setup
│   ├── lib/                     # Server utilities
│   │   └── supabase.ts          # Server Supabase client
│   └── services/                # Business logic
│       ├── marketplace.service.ts  # Freelancer/job queries
│       ├── payment.service.ts   # Payment processing
│       ├── messaging.service.ts # Real-time messaging
│       ├── storage.service.ts   # File uploads
│       └── email.service.ts     # Email notifications
│
├── src/                         # Next.js application
│   ├── app/                     # App Router
│   │   ├── (marketing)/         # Public pages
│   │   ├── (app)/               # Protected pages
│   │   └── api/                 # API routes
│   ├── shared/                  # Shared utilities
│   │   ├── types/               # TypeScript types
│   │   └── utils.ts             # Helper functions
│   └── database/                # Legacy (to be migrated)
│
├── database/                    # Database
│   └── schema.sql               # PostgreSQL schema
│
├── middleware.ts                # Route protection & session refresh
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/project-ace.git
cd project-ace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - Project URL
   - Anon key
3. Run the database schema in **SQL Editor**:
   ```bash
   # Copy contents of database/schema.sql and execute in Supabase SQL Editor
   ```
4. Set up Storage buckets:
   - Create buckets: `avatars`, `portfolio`, `service-images`
   - Set all to **public**
5. Enable Google OAuth (optional):
   - **Authentication → Providers → Google**
   - Add your Google OAuth credentials
   - Set redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 4. Set up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from **Developers → API keys**
3. Set up webhook:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret

### 5. Set up Resend

1. Create account at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Verify your sending domain

### 6. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@yourdomain.com

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Database Schema

The platform uses PostgreSQL with the following main tables:

- `profiles` - User profiles (extends auth.users)
- `freelancer_profiles` - Extended freelancer information
- `portfolio_items` - Freelancer portfolio entries
- `services` - Fixed-price service listings
- `job_posts` - Client project postings
- `proposals` - Freelancer bids
- `contracts` - Active project agreements
- `payments` - Transaction records
- `reviews` - Feedback system
- `conversations` - Message threads
- `messages` - Chat messages
- `admin_events` - Audit log

**Key Features:**
- Row-Level Security (RLS) policies
- Realtime subscriptions for messaging
- Views for aggregated statistics
- Triggers for auto-updates
- Indexes for performance

## 🔒 Security

- **Row-Level Security (RLS)** - All tables protected
- **Role-based access control** - Client, Freelancer, Admin
- **Protected routes** - Middleware authentication
- **Secure file uploads** - Size and type validation
- **Escrow payments** - Stripe integration
- **Input validation** - Zod schemas
- **SQL injection protection** - Parameterized queries
- **XSS protection** - Next.js automatic escaping

## 🧪 Testing Locally

### Test Stripe Webhooks

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Use test card: 4242 4242 4242 4242
```

### Test Email Notifications

With Resend, test emails are sent to your registered email address.

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Post-Deployment

1. Update Supabase redirect URLs:
   - **Authentication → URL Configuration**
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

2. Update Stripe webhook URL:
   - `https://your-domain.com/api/webhooks/stripe`

3. Update environment variables:
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`

## 📊 Admin Setup

To create an admin user:

1. Sign up through the UI
2. In Supabase SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

## 🔄 Architecture Decisions

### Why Server/Client Separation?

- **Clear boundaries**: Server logic separate from UI
- **Type safety**: Shared types between layers
- **Performance**: Server Components by default
- **Security**: Sensitive operations server-side only

### Why Supabase?

- **PostgreSQL**: Robust, scalable database
- **Built-in Auth**: Email, OAuth, sessions
- **Real-time**: WebSocket subscriptions
- **Storage**: File uploads out of the box
- **RLS**: Database-level security

### Why Stripe?

- **Industry standard**: Trusted payment processor
- **Escrow support**: Hold funds until release
- **Webhooks**: Event-driven payment flow
- **Developer friendly**: Excellent documentation

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📧 Email: support@projectace.com
- 💬 Discord: [Join our community](https://discord.gg/projectace)
- 📚 Docs: [docs.projectace.com](https://docs.projectace.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Built with ❤️ by the Project Ace team**
