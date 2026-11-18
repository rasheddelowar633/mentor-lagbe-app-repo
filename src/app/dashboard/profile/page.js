"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import RoleBadge from "@/components/RoleBadge";
import { uploadImageToImgBB } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
  const { user, profile, role, plan, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "",
    imageUrlInput: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  /* Seed the form from the loaded session — adjusted during render so we
     never setState inside an effect. Re-seeds only when the identity or
     stored profile fields actually change. */
  const mounted = Boolean(user);
  const seed = user
    ? `${user.id || user._id || user.email}::${profile?.name || ""}::${profile?.phone || ""}::${profile?.bio || ""}::${profile?.image || user.image || ""}`
    : "";
  const [appliedSeed, setAppliedSeed] = useState(seed);
  if (user && seed !== appliedSeed) {
    setAppliedSeed(seed);
    setForm({
      name: profile?.name || user.name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      image: profile?.image || user.image || "",
      imageUrlInput: "",
    });
  }

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded to ImgBB.");
    } catch (error) {
      toast.error(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const url = form.imageUrlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      toast.error("Enter a valid image URL (https://…).");
      return;
    }
    setForm((prev) => ({ ...prev, image: url }));
    toast.success("Profile image updated from URL.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        image: form.image,
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const initials = (form.name || user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Update Profile</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Keep your name, contact details and photo up to date — changes appear
          across the whole platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Photo card */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6 text-center">
          <span className="relative mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-4xl font-extrabold text-primary">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
            {uploading && (
              <span className="absolute inset-0 grid place-items-center bg-black/50 text-white">
                <Loader2 className="h-7 w-7 animate-spin" />
              </span>
            )}
          </span>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="profile-image"
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-brand mt-5 w-full !py-2.5 text-sm"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" /> Upload via ImgBB
              </>
            )}
          </button>

          <div className="mt-4 flex gap-2">
            <input
              type="url"
              value={form.imageUrlInput}
              onChange={setField("imageUrlInput")}
              placeholder="…or paste image URL"
              className="field-input !py-2 text-xs"
            />
            <button
              type="button"
              onClick={applyUrl}
              className="btn btn-square btn-outline btn-sm shrink-0"
              aria-label="Use image URL"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-dashed border-base-content/15 pt-4">
            <RoleBadge role={role} />
            <span
              className={`badge badge-sm font-bold ${
                plan === "pro" ? "badge-accent" : "badge-ghost"
              }`}
            >
              {plan === "pro" ? "PRO PLAN" : "FREE PLAN"}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="rounded-3xl border border-base-content/10 bg-base-100 p-6 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="field-label">
                Full name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45" />
                <input
                  id="profile-name"
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  className="field-input !pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="field-label">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45" />
                <input
                  id="profile-email"
                  type="email"
                  value={profile?.email || user?.email || ""}
                  readOnly
                  className="field-input !pl-10 opacity-70"
                />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-base-content/45">
                Email is managed by your login account.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-phone" className="field-label">
                Phone number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45" />
                <input
                  id="profile-phone"
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  className="field-input !pl-10"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile-bio" className="field-label">
                Bio
              </label>
              <textarea
                id="profile-bio"
                rows={4}
                value={form.bio}
                onChange={setField("bio")}
                className="field-input resize-none"
                placeholder="A short intro — subjects you teach, your institution, achievements…"
              />
              <p className="mt-1.5 text-right text-[11px] font-semibold text-base-content/45">
                {form.bio.length}/300 characters
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10 pt-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-base-content/55">
              <ShieldCheck className="h-4 w-4 text-success" />
              Your data is stored securely on MentorLagbe.
            </p>
            <button type="submit" disabled={saving} className="btn-brand">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
