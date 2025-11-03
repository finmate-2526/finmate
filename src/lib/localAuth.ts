// Simple local authentication helper using localStorage.
// Not secure — suitable for local dev or demo only.

export type LocalUser = {
  email: string;
  passwordHash: string;
  createdAt: string;
};

const USERS_KEY = "local_users_v1";
const SESSION_KEY = "local_session_v1";

async function hashPassword(password: string): Promise<string> {
  try {
    // Use Web Crypto API when available
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // Fallback (less secure)
    return btoa(password);
  }
}

function loadUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalUser[];
  } catch (err) {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function register(email: string, password: string): Promise<{ user?: LocalUser; error?: string }> {
  const users = loadUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return { error: "A user with that email already exists." };

  const passwordHash = await hashPassword(password);
  const user: LocalUser = { email, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  // create session
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }));
  return { user };
}

export async function login(email: string, password: string): Promise<{ user?: LocalUser; error?: string }> {
  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { error: "No user found with that email." };

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) return { error: "Invalid credentials." };

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }));
  return { user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): { email: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { email: string };
  } catch (err) {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
