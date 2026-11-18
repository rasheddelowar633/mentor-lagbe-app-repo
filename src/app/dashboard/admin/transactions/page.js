"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  Copy,
  CreditCard,
  DollarSign,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import RoleBadge from "@/components/RoleBadge";
import StatCard from "@/components/dashboard/StatCard";
import { EmptyState, StatCardSkeleton, TableSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatAmount(amount, currency) {
  const value = Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const code = (currency || "USD").toUpperCase();
  return { value, code };
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/payments");
      setPayments(pickList(payload));
      setError(null);
    } catch (err) {
      setError(err.message);
      setPayments([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const list = useMemo(() => payments || [], [payments]);

  const totals = useMemo(() => {
    const revenue = list.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    return {
      count: list.length,
      revenue: revenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      tutorSales: list.filter((item) => /tutor/i.test(item.planName || ""))
        .length,
      studentSales: list.filter((item) => /student/i.test(item.planName || ""))
        .length,
    };
  }, [list]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (item) =>
        (item.userName || "").toLowerCase().includes(query) ||
        (item.userEmail || "").toLowerCase().includes(query) ||
        (item.transactionId || "").toLowerCase().includes(query),
    );
  }, [list, search]);

  const copyId = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Transaction ID copied.");
    } catch {
      toast.error("Could not copy the transaction ID.");
    }
  };

  const idCell = (item) => {
    const id = item.transactionId || "—";
    return (
      <span className="flex items-center gap-2">
        <span className="block max-w-[10rem] truncate font-mono text-xs font-semibold text-base-content/70">
          {id}
        </span>
        {item.transactionId && (
          <button
            type="button"
            onClick={() => copyId(item.transactionId)}
            title="Copy transaction ID"
            aria-label={`Copy transaction ID ${item.transactionId}`}
            className="btn btn-square btn-ghost btn-xs shrink-0"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    );
  };

  const amountCell = (item) => {
    const { value, code } = formatAmount(item.amount, item.currency);
    return (
      <span className="whitespace-nowrap font-extrabold">
        ${value}
        <span className="ml-1 text-[11px] font-bold text-base-content/45">
          {code}
        </span>
      </span>
    );
  };

  if (payments === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <StatCardSkeleton count={4} />
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Transaction Management
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Every Stripe subscription payment recorded on MentorLagbe.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total transactions"
          value={totals.count.toLocaleString("en-US")}
          hint="Successful payments"
          tone="primary"
        />
        <StatCard
          icon={Wallet}
          label="Total revenue"
          value={`$${totals.revenue}`}
          hint="Lifetime Stripe earnings"
          tone="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Pro Tutor sales"
          value={totals.tutorSales.toLocaleString("en-US")}
          hint="$15 / month subscriptions"
          tone="secondary"
        />
        <StatCard
          icon={CreditCard}
          label="Pro Student sales"
          value={totals.studentSales.toLocaleString("en-US")}
          hint="$10 / month subscriptions"
          tone="success"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or transaction ID…"
          aria-label="Search transactions"
          className="field-input !pl-10"
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={error ? "Transactions unavailable" : "No transactions yet"}
          description={
            error
              ? "We could not reach the payments API — fix the connection and reload."
              : "Once a tutor or student upgrades to a Pro plan through Stripe, the payment record will appear here."
          }
          action={
            <button
              type="button"
              onClick={() => void load()}
              className="btn-ghost-brand"
            >
              <DollarSign className="h-4 w-4" /> Try again
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching transactions"
          description="No payment record matches your search."
          action={
            <button
              type="button"
              onClick={() => setSearch("")}
              className="btn-ghost-brand"
            >
              Clear search
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 md:block">
            <table className="table">
              <thead className="bg-base-200 text-xs font-extrabold uppercase tracking-widest text-base-content/60">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Payment date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((item, index) => (
                  <tr
                    key={item._id || item.transactionId || index}
                    className="border-base-content/10"
                  >
                    <td>
                      <span className="block truncate font-extrabold">
                        {item.userName || "Unknown"}
                      </span>
                      <span className="block truncate text-xs font-semibold text-base-content/55">
                        {item.userEmail || "—"}
                      </span>
                    </td>
                    <td>
                      <RoleBadge role={item.userRole} />
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm font-bold">
                        {item.planName || "—"}
                      </span>
                    </td>
                    <td>{amountCell(item)}</td>
                    <td>{idCell(item)}</td>
                    <td className="font-semibold text-base-content/65">
                      {formatDate(item.paidAt || item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {filtered.map((item, index) => (
              <div
                key={item._id || item.transactionId || index}
                className="rounded-3xl border border-base-content/10 bg-base-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">
                      {item.userName || "Unknown"}
                    </p>
                    <p className="truncate text-xs font-semibold text-base-content/55">
                      {item.userEmail || "—"}
                    </p>
                  </div>
                  {amountCell(item)}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RoleBadge role={item.userRole} />
                  <span className="badge badge-ghost badge-sm font-bold">
                    {item.planName || "—"}
                  </span>
                  <span className="text-[11px] font-semibold text-base-content/50">
                    {formatDate(item.paidAt || item.createdAt)}
                  </span>
                </div>

                {item.transactionId && (
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-base-content/15 pt-4">
                    <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-base-content/70">
                      {item.transactionId}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyId(item.transactionId)}
                      className="btn btn-ghost btn-xs shrink-0 gap-1 font-bold"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
