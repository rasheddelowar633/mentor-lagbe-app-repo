
/**
 * MentorLagbe API helper.
 * Automatically gets Better Auth JWT when no token is stored.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || `${API_URL}/api/auth`;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const TOKEN_KEY = "mentorlagbe_token";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function clearToken() {
  setToken(null);
}

/**
 * Get JWT from Better Auth when localStorage has no token.
 */
async function getAuthToken() {
  // First check localStorage
  const storedToken = getToken();

  if (storedToken) {
    return storedToken;
  }

  try {
    const response = await fetch(`${AUTH_URL}/token`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Unable to get Better Auth JWT:", response.status);
      return null;
    }

    const result = await response.json();

    const jwtToken =
      typeof result?.token === "string" ? result.token : null;

    if (jwtToken) {
      setToken(jwtToken);
      console.log("MentorLagbe JWT successfully stored.");
    }

    return jwtToken;
  } catch (error) {
    console.error("JWT fetching failed:", error.message);
    return null;
  }
}

/**
 * Fetch JSON from Express backend.
 */
export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    token,
    cache = "no-store",
    signal,
  } = options;

  // Automatically retrieve JWT if necessary
  const activeToken = auth
    ? (token ?? await getAuthToken())
    : null;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body && !isFormData
          ? { "Content-Type": "application/json" }
          : {}),
        ...(activeToken
          ? { Authorization: `Bearer ${activeToken}` }
          : {}),
        ...headers,
      },
      body: isFormData
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
      credentials: "include",
      cache,
      signal,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the MentorLagbe server. Please check your connection and try again.",
      0,
      null
    );
  }

  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (response.status === 401
        ? "You are not authorized to perform this action."
        : `Request failed (${response.status})`);

    throw new ApiError(message, response.status, data);
  }

  return data;
}

/**
 * Upload image to ImgBB.
 */
export async function uploadImageToImgBB(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key || key.toLowerCase().includes("your_")) {
    throw new ApiError(
      "ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local.",
      0,
      null
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  let response;

  try {
    response = await fetch(
      `https://api.imgbb.com/1/upload?key=${key}`,
      {
        method: "POST",
        body: formData,
      }
    );
  } catch {
    throw new ApiError(
      "Image upload failed. Check your network connection.",
      0,
      null
    );
  }

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.data?.url) {
    throw new ApiError(
      json?.error?.message || "Image upload failed.",
      response.status,
      json
    );
  }

  return json.data.url;
}

/**
 * Create Stripe Checkout session.
 */
export async function createCheckoutSession(planId, extra = {}) {
  const data = await apiFetch("/api/payments/checkout", {
    method: "POST",
    body: { planId, ...extra },
  });

  return data?.url;
}

/**
 * Resolve backend image URL.
 */
export function resolveImageUrl(url) {
  if (!url) return null;

  if (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("data:") ||
    url.startsWith("/")
  ) {
    return url;
  }

  return `${API_URL}/${url.replace(/^\//, "")}`;
}
