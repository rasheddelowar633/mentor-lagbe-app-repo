"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Search, ShieldCheck } from "lucide-react";
import RoleBadge from "@/components/RoleBadge";
import { EmptyState, TableSkeleton } from "@/components/Skeletons";
import { apiFetch } from "@/lib/api";
import { pickList } from "@/lib/payload";
import { useAuth } from "@/providers/AuthProvider";

const ROLE_OPTIONS = ["student", "tutor", "admin"];

const ROLE_FILTERS = [
  { value: "all", label: "All roles" },
  { value: "student", label: "Student" },
  { value: "tutor", label: "Tutor" },
  { value: "admin", label: "Admin" },
];

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

function initials(name, email) {
  const source = name || email || "U";
  return source.charAt(0).toUpperCase();
}

export default function AdminUsersPage() {
  const { user, profile } = useAuth();

  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/users");
      setUsers(pickList(payload));
      setError(null);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const myId = profile?._id || null;
  const myEmail = (user?.email || profile?.email || "").toLowerCase();

  const isSelf = (row) =>
    Boolean(
      (myId && (row._id || row.id) === myId) ||
        (myEmail && (row.email || "").toLowerCase() === myEmail),
    );

  const handleRoleChange = async (row, nextRole) => {
    const id = row._id || row.id;
    if (!id || !nextRole || nextRole === row.role) return;
    if (isSelf(row)) return;

    const confirmed = window.confirm(
      `Change ${row.name || row.email} from "${row.role}" to "${nextRole}"?`,
    );
    if (!confirmed) return;

    setSavingId(id);
    try {
      await apiFetch(`/api/users/${id}/role`, {
        method: "PATCH",
        body: { role: nextRole },
      });
      setUsers((prev) =>
        (prev || []).map((item) =>
          (item._id || item.id) === id ? { ...item, role: nextRole } : item,
        ),
      );
      toast.success(
        `${row.name || row.email} is now ${nextRole === "admin" ? "an admin" : `a ${nextRole}`}.`,
      );
    } catch (err) {
      toast.error(err.message || "Could not update the user role.");
    } finally {
      setSavingId(null);
    }
  };

  const list = useMemo(() => users || [], [users]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return list.filter((row) => {
      const matchesQuery =
        !query ||
        (row.name || "").toLowerCase().includes(query) ||
        (row.email || "").toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || row.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [list, search, roleFilter]);

  const roleSelect = (row) => {
    const id = row._id || row.id;
    const self = isSelf(row);
    return (
      <select
        value={row.role || "student"}
        onChange={(event) => handleRoleChange(row, event.target.value)}
        disabled={self || savingId === id}
        title={self ? "You cannot change your own role" : undefined}
        aria-label={`Change role for ${row.name || row.email}`}
        className="field-input !w-36 !py-2 text-sm font-bold"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    );
  };

  if (users === null && !error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-56 rounded-lg" />
        <TableSkeleton rows={6} cols={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          User Management
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Every registered account on MentorLagbe — promote, demote or inspect
          roles in one place.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="field-input !pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          aria-label="Filter by role"
          className="field-input sm:!w-48"
        >
          {ROLE_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={error ? "Users unavailable" : "No users yet"}
          description={
            error
              ? "We could not reach the users API — fix the connection and reload."
              : "Once people register on MentorLagbe their accounts will appear here."
          }
          action={
            <button type="button" onClick={() => void load()} className="btn-ghost-brand">
              Try again
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching users"
          description="No account matches your current search and role filter."
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="btn-ghost-brand"
            >
              Clear filters
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
                  <th>Joined</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((row) => {
                  const id = row._id || row.id;
                  const self = isSelf(row);
                  return (
                    <tr key={id} className="border-base-content/10">
                      <td>
                        <span className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-extrabold text-primary">
                            {row.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={row.image}
                                alt={row.name || row.email}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              initials(row.name, row.email)
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-extrabold">
                              {row.name || "Unnamed user"}
                            </span>
                            <span className="flex items-center gap-1 truncate text-xs font-semibold text-base-content/55">
                              <Mail className="h-3 w-3 shrink-0" />
                              {row.email}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <RoleBadge role={row.role} />
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm font-bold ${
                            row.plan === "pro" ? "badge-accent" : "badge-ghost"
                          }`}
                        >
                          {row.plan === "pro" ? "PRO" : "FREE"}
                        </span>
                      </td>
                      <td className="font-semibold text-base-content/65">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="text-right">
                        {roleSelect(row)}
                        {savingId === id && (
                          <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-primary" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {filtered.map((row) => {
              const id = row._id || row.id;
              return (
                <div
                  key={id}
                  className="rounded-3xl border border-base-content/10 bg-base-100 p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-base font-extrabold text-primary">
                      {row.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.image}
                          alt={row.name || row.email}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(row.name, row.email)
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold">
                        {row.name || "Unnamed user"}
                      </p>
                      <p className="truncate text-xs font-semibold text-base-content/55">
                        {row.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <RoleBadge role={row.role} />
                        <span
                          className={`badge badge-sm font-bold ${
                            row.plan === "pro" ? "badge-accent" : "badge-ghost"
                          }`}
                        >
                          {row.plan === "pro" ? "PRO" : "FREE"}
                        </span>
                        <span className="text-[11px] font-semibold text-base-content/50">
                          Joined {formatDate(row.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-dashed border-base-content/15 pt-4">
                    <span className="field-label !mb-1.5 text-xs">
                      Change role
                    </span>
                    {roleSelect(row)}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="flex items-center gap-1.5 text-xs font-semibold text-base-content/50">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Role changes are applied immediately and take effect on the
            user&apos;s next request.
          </p>
        </>
      )}
    </div>
  );
}
