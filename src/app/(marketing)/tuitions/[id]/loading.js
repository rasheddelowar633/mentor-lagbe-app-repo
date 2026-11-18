export default function TuitionDetailsLoading() {
  return (
    <div className="container-x py-10 md:py-14">
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton mt-5 h-56 w-full rounded-3xl md:h-72" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="skeleton h-9 w-3/4 rounded-lg" />
          <div className="skeleton mt-4 h-4 w-1/2 rounded" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton mt-8 h-52 w-full rounded-3xl" />
          <div className="skeleton mt-6 h-28 w-full rounded-3xl" />
        </div>
        <div className="space-y-6">
          <div className="skeleton h-36 w-full rounded-3xl" />
          <div className="skeleton h-72 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
