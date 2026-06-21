import { HeroSection } from "@/client/components/home/hero-section";
import { SearchSection } from "@/client/components/home/search-section";
import { FeaturesSection } from "@/client/components/home/features-section";
import { CategoriesSection } from "@/client/components/home/categories-section";
import { TopFreelancersSection } from "@/client/components/home/top-freelancers-section";
import { RecentProjectsSection } from "@/client/components/home/recent-projects-section";
import { HowItWorksSection } from "@/client/components/home/how-it-works-section";
import { PricingSection } from "@/client/components/home/pricing-section";
import { FAQSection } from "@/client/components/home/faq-section";
import {
  getCategories,
  getCategoryStats,
  getFeaturedFreelancers,
  getPlatformCounters,
  getRecentProjects,
} from "@/server/marketplace/queries";

export default async function HomePage() {
  const [categories, categoryStats, featuredFreelancers, recentProjects, counters] =
    await Promise.all([
      getCategories(),
      getCategoryStats(),
      getFeaturedFreelancers(),
      getRecentProjects(),
      getPlatformCounters(),
    ]);

  return (
    <>
      <HeroSection counters={counters} />
      <SearchSection categories={categories} />
      <FeaturesSection />
      <CategoriesSection categories={categoryStats} />
      <TopFreelancersSection freelancers={featuredFreelancers} />
      <RecentProjectsSection projects={recentProjects} />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
