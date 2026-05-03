import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  skipAuth?: boolean; // true untuk endpoint login/register
}

// ─── Refresh token (dipanggil otomatis saat 401) ──────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function doRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  const accessToken  = getAccessToken();

  if (!refreshToken) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("No refresh token");
  }

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Refresh failed");
  }

  const json = await res.json();
  const newTokens = {
    accessToken:  json.data.accessToken,
    refreshToken: json.data.refreshToken,
  };
  setTokens(newTokens);
  return newTokens.accessToken;
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;

  const buildHeaders = (token?: string | null): Record<string, string> => ({
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  });

  // ── First attempt ──────────────────────────────────────────────────────────
  let response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: buildHeaders(getAccessToken()),
  });

  // ── Auto-refresh on 401 ────────────────────────────────────────────────────
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await doRefresh();
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        // Retry original request dengan token baru
        response = await fetch(`${BASE}${path}`, {
          ...rest,
          headers: buildHeaders(newToken),
        });
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        throw err;
      }
    } else {
      // Kalau sudah ada proses refresh berjalan, antri dulu
      const newToken = await new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      });
      response = await fetch(`${BASE}${path}`, {
        ...rest,
        headers: buildHeaders(newToken),
      });
    }
  }

  // ── Parse response ─────────────────────────────────────────────────────────
  const data = await response.json();

  if (!response.ok) {
    // Backend biasanya return { message: "..." } saat error
    throw new Error(data?.message ?? "Terjadi kesalahan. Coba lagi.");
  }

  return data as T;
}

// ─── Shorthand methods ────────────────────────────────────────────────────────
export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { method: "GET", ...options }),

  post: <T = unknown>(path: string, body: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T = unknown>(path: string, body: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T = unknown>(path: string, body: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  del: <T = unknown>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { method: "DELETE", ...options }),
};