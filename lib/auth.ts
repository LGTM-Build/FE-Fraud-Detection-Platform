// ─── Types ────────────────────────────────────────────────────────────────────
export type Role = "super_user" | "auditor" | "operator";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────
const KEY_ACCESS  = "fradara_access";
const KEY_REFRESH = "fradara_refresh";
const KEY_USER    = "fradara_user";

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_ACCESS);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_REFRESH);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(KEY_ACCESS,  tokens.accessToken);
  localStorage.setItem(KEY_REFRESH, tokens.refreshToken);
  // Set cookie agar middleware (server-side) bisa baca token
  setCookieToken(tokens.accessToken);
}

export function clearTokens(): void {
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_USER);
  // Hapus cookie
  document.cookie = `${KEY_ACCESS}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Cookie helper (dibaca oleh middleware) ───────────────────────────────────
export function setCookieToken(accessToken: string): void {
  // HttpOnly tidak bisa di-set dari JS — cukup SameSite=Lax untuk proteksi CSRF dasar
  document.cookie = `${KEY_ACCESS}=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

// ─── User helpers ─────────────────────────────────────────────────────────────
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}

// ─── Session check ────────────────────────────────────────────────────────────
export function isLoggedIn(): boolean {
  return !!getAccessToken();
}