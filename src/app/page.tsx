import { HeroSection } from "@/components/home/hero-section";
import { SearchSection } from "@/components/home/search-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { TopFreelancersSection } from "@/components/home/top-freelancers-section";
import { RecentProjectsSection } from "@/components/home/recent-projects-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PricingSection } from "@/components/home/pricing-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <CategoriesSection />
      <TopFreelancersSection />
      <RecentProjectsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
