import { TuitionGridSkeleton } from "@/components/Skeletons";

export default function TuitionsLoading() {
  return (
    <div className="container-x py-12 md:py-16">
      <div className="skeleton h-5 w-40 rounded-full" />
      <div className="skeleton mt-5 h-10 w-2/3 max-w-xl rounded-lg" />
      <div className="skeleton mt-4 h-5 w-full max-w-2xl rounded" />
      <div className="skeleton mt-8 h-32 w-full rounded-3xl" />
      <div className="mt-10">
        <TuitionGridSkeleton count={6} />
      </div>
    </div>
  );
}
