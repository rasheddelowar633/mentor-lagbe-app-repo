import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState } from "@/components/Skeletons";
import Reveal from "@/components/Reveal";
import { apiFetch } from "@/lib/api";

function pickList(payload) {
  if (Array.isArray(payload)) return payload;
  return (
    payload?.tuitions ||
    payload?.data ||
    payload?.items ||
    payload?.results ||
    []
  );
}

async function getFeaturedTuitions() {
  try {
    const payload = await apiFetch(
      "/api/tuitions?approved=true&limit=6&sort=latest",
      { auth: false },
    );
    return pickList(payload);
  } catch {
    return [];
  }
}

export default async function FeaturedTuitionSection() {
  const tuitions = await getFeaturedTuitions();

  return (
    <section className="container-x py-16 md:py-24">
      <SectionHeader
        eyebrow={<><Sparkles className="h-3.5 w-3.5" /> Featured batches</>}
        title="Latest approved tuition listings"
        description="Freshly reviewed and approved by our admins — every listing below is active and accepting applications right now."
        action={
          <Link href="/tuitions" className="btn-ghost-brand">
            View all tuitions <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-12">
        {tuitions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.slice(0, 6).map((tuition, index) => (
              <Reveal key={tuition._id || tuition.id || index} delay={(index % 3) * 90}>
                <TuitionCard tuition={tuition} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tuitions published yet"
            description="Once tutors post batches and the admin approves them, the latest six listings will appear here automatically."
            action={
              <Link href="/sign-up?role=tutor" className="btn-brand">
                Post the first tuition
              </Link>
            }
          />
        )}
      </div>
    </section>
  );
}
