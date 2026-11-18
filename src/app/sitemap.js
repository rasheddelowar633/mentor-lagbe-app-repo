const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = ["", "/tuitions", "/pricing", "/sign-in", "/sign-up"];

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  /* Individual tuition pages are dynamic — surface the ones the API knows. */
  let tuitionEntries = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/tuitions?limit=100`,
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const payload = await res.json();
      const items = Array.isArray(payload) ? payload : payload?.tuitions || payload?.data || [];
      tuitionEntries = items
        .filter((item) => item?._id || item?.id)
        .map((item) => ({
          url: `${siteUrl}/tuitions/${item._id || item.id}`,
          changeFrequency: "daily",
          priority: 0.6,
        }));
    }
  } catch {
    /* API unreachable — sitemap still renders static routes. */
  }

  return [...staticEntries, ...tuitionEntries];
}
