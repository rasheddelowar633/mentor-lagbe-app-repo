import { StatCardSkeleton, TableSkeleton } from "@/components/Skeletons";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="skeleton h-8 w-56 rounded-lg" />
      <StatCardSkeleton count={4} />
      <TableSkeleton rows={5} cols={4} />
    </div>
  );
}
