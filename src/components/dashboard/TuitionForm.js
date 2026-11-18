"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import { uploadImageToImgBB } from "@/lib/api";
import { SUBJECTS, CLASS_LEVELS, MODES } from "@/lib/constants";

/** Builds the blank/local form state from any tuition document (or {}). */
function toFormValues(source) {
  const src = source || {};
  return {
    title: src.title || "",
    subject: src.subject || "",
    classLevel: src.classLevel || "",
    mode: src.mode || "Online",
    location: src.location || "",
    monthlyFee: src.monthlyFee != null ? String(src.monthlyFee) : "",
    daysPerWeek: src.daysPerWeek != null ? String(src.daysPerWeek) : "3",
    bannerImage: src.bannerImage || "",
    imageUrlInput: "",
    description: src.description || "",
  };
}

/** Basic client-side validation — returns a map of field -> error message. */
function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < 6) {
    errors.title = "Title must be at least 6 characters.";
  }

  if (!values.subject) errors.subject = "Please choose a subject.";
  if (!values.classLevel) errors.classLevel = "Please choose a class level.";
  if (!values.mode) errors.mode = "Please choose a mode.";

  const fee = Number(values.monthlyFee);
  if (!values.monthlyFee || Number.isNaN(fee) || fee <= 0) {
    errors.monthlyFee = "Monthly fee must be a positive number.";
  }

  const days = Number(values.daysPerWeek);
  if (!values.daysPerWeek || Number.isNaN(days) || days < 1 || days > 7) {
    errors.daysPerWeek = "Days per week must be between 1 and 7.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-error">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  );
}

/**
 * Reusable tuition create/update form.
 * Calls `onSubmit(values)` with a plain values object (never the event).
 */
export default function TuitionForm({
  initialValue = {},
  submitLabel = "Post Tuition",
  onSubmit,
  submitting = false,
}) {
  const [form, setForm] = useState(() => toFormValues(initialValue));
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // Re-prefill when a different tuition record is loaded (edit page).
  // Adjusted during render (React's "derived state from props" pattern)
  // instead of an effect, so typing is never clobbered by re-renders.
  const recordKey = initialValue?._id || initialValue?.id || "";
  const [prefillKey, setPrefillKey] = useState(recordKey);
  if (recordKey !== prefillKey) {
    setPrefillKey(recordKey);
    setForm(toFormValues(initialValue));
    setErrors({});
  }

  const setField = (key) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

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
      setForm((prev) => ({ ...prev, bannerImage: url }));
      toast.success("Banner image uploaded to ImgBB.");
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
    setForm((prev) => ({ ...prev, bannerImage: url, imageUrlInput: "" }));
    toast.success("Banner image updated from URL.");
  };

  const removeBanner = () => {
    setForm((prev) => ({ ...prev, bannerImage: "", imageUrlInput: "" }));
  };

  const handleReset = () => {
    setForm(toFormValues(recordKey ? initialValue : {}));
    setErrors({});
    toast.info("Form reset.");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (uploading) return;

    const found = validate(form);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    onSubmit?.({
      title: form.title.trim(),
      subject: form.subject,
      classLevel: form.classLevel,
      mode: form.mode,
      location: form.location.trim(),
      monthlyFee: Number(form.monthlyFee),
      daysPerWeek: Number(form.daysPerWeek),
      bannerImage: form.bannerImage,
      description: form.description.trim(),
    });
  };

  const invalidClass = " !border-error";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label htmlFor="tuition-title" className="field-label">
            Tuition title
          </label>
          <input
            id="tuition-title"
            type="text"
            value={form.title}
            onChange={setField("title")}
            className={`field-input${errors.title ? invalidClass : ""}`}
            placeholder="e.g. HSC Physics — Weekly batch, Gulshan 2"
          />
          <FieldError message={errors.title} />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="tuition-subject" className="field-label">
            Subject
          </label>
          <select
            id="tuition-subject"
            value={form.subject}
            onChange={setField("subject")}
            className={`field-input${errors.subject ? invalidClass : ""}`}
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <FieldError message={errors.subject} />
        </div>

        {/* Class level */}
        <div>
          <label htmlFor="tuition-class-level" className="field-label">
            Class level
          </label>
          <select
            id="tuition-class-level"
            value={form.classLevel}
            onChange={setField("classLevel")}
            className={`field-input${errors.classLevel ? invalidClass : ""}`}
          >
            <option value="">Select a class level</option>
            {CLASS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <FieldError message={errors.classLevel} />
        </div>

        {/* Mode */}
        <div>
          <label htmlFor="tuition-mode" className="field-label">
            Mode
          </label>
          <select
            id="tuition-mode"
            value={form.mode}
            onChange={setField("mode")}
            className={`field-input${errors.mode ? invalidClass : ""}`}
          >
            <option value="">Select a mode</option>
            {MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <FieldError message={errors.mode} />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="tuition-location" className="field-label">
            Location
          </label>
          <input
            id="tuition-location"
            type="text"
            value={form.location}
            onChange={setField("location")}
            className="field-input"
            placeholder={
              form.mode === "Online" ? "e.g. Google Meet (city optional)" : "e.g. Dhanmondi, Dhaka"
            }
          />
        </div>

        {/* Monthly fee */}
        <div>
          <label htmlFor="tuition-fee" className="field-label">
            Monthly fee (৳)
          </label>
          <input
            id="tuition-fee"
            type="number"
            min="1"
            value={form.monthlyFee}
            onChange={setField("monthlyFee")}
            className={`field-input${errors.monthlyFee ? invalidClass : ""}`}
            placeholder="e.g. 4500"
          />
          <FieldError message={errors.monthlyFee} />
        </div>

        {/* Days per week */}
        <div>
          <label htmlFor="tuition-days" className="field-label">
            Days per week
          </label>
          <input
            id="tuition-days"
            type="number"
            min="1"
            max="7"
            value={form.daysPerWeek}
            onChange={setField("daysPerWeek")}
            className={`field-input${errors.daysPerWeek ? invalidClass : ""}`}
            placeholder="e.g. 3"
          />
          <FieldError message={errors.daysPerWeek} />
        </div>

        {/* Banner image */}
        <div className="sm:col-span-2">
          <label htmlFor="tuition-banner" className="field-label">
            Banner image
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl border border-base-content/10 bg-base-200 sm:w-56">
              {form.bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.bannerImage}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-xs font-bold text-base-content/40">
                  No banner yet
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 grid place-items-center bg-black/50 text-white">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <input
                ref={fileRef}
                id="tuition-banner"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-ghost-brand !py-2.5 text-sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload via ImgBB
                  </>
                )}
              </button>

              <div className="flex gap-2">
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

              {form.bannerImage && (
                <button
                  type="button"
                  onClick={removeBanner}
                  className="text-xs font-extrabold text-error hover:underline"
                >
                  Remove banner image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="tuition-description" className="field-label">
            Description
          </label>
          <textarea
            id="tuition-description"
            rows={5}
            value={form.description}
            onChange={setField("description")}
            className={`field-input resize-none${errors.description ? invalidClass : ""}`}
            placeholder="Syllabus covered, schedule, your teaching experience, what students can expect…"
          />
          <FieldError message={errors.description} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10 pt-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-base-content/55">
          <AlertTriangle className="h-4 w-4 text-warning" />
          New posts are reviewed by an admin before going live.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleReset} disabled={submitting} className="btn-ghost-brand">
            Reset
          </button>
          <button type="submit" disabled={submitting || uploading} className="btn-brand">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
