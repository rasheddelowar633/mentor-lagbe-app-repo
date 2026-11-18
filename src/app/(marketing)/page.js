import Hero from "@/components/home/Hero";
import FeaturedTuitionSection from "@/components/home/FeaturedTuitionSection";
import HowItWorks from "@/components/home/HowItWorks";
import PricingPreview from "@/components/home/PricingPreview";
import StatsTestimonials from "@/components/home/StatsTestimonials";
import CtaBand from "@/components/home/CtaBand";

export const metadata = {
  title: "MentorLagbe — Find Your Ideal Tutor or Mentorship Batch Today",
  description:
    "Search admin-approved tuition batches by subject, class level, mode and monthly budget. Students apply in seconds, tutors manage applicants in one dashboard.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTuitionSection />
      <HowItWorks />
      <PricingPreview />
      <StatsTestimonials />
      <CtaBand />
    </>
  );
}
