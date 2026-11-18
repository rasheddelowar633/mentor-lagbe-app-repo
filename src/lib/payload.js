/** Normalises the different shapes an Express API may return. */

export function pickList(payload) {
  if (Array.isArray(payload)) return payload;
  return (
    payload?.tuitions ||
    payload?.applications ||
    payload?.payments ||
    payload?.users ||
    payload?.data ||
    payload?.items ||
    payload?.results ||
    []
  );
}

export function pickOne(payload) {
  if (!payload || typeof payload !== "object") return payload ?? null;
  return (
    payload?.tuition ||
    payload?.application ||
    payload?.payment ||
    payload?.user ||
    payload?.data ||
    payload?.item ||
    payload
  );
}

export function pickPagination(payload, fallbackPage = 1, fallbackLimit = 12) {
  const total = Number(payload?.total ?? payload?.totalCount ?? 0);
  const page = Number(payload?.page ?? fallbackPage);
  const limit = Number(payload?.limit ?? payload?.pageSize ?? fallbackLimit);
  const pages =
    Number(payload?.pages ?? payload?.totalPages) ||
    Math.max(1, Math.ceil(total / (limit || 1)));
  return { total, page, limit, pages };
}
