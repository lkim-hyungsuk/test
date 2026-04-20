const BASE = process.env.REACT_APP_API_URL || "";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ── Public ────────────────────────────────────────────────────────────────────
export const fetchTutorials = () => request<any[]>("/tutorials");
export const fetchTutorial  = (slug: string) => request<any>(`/tutorials/${slug}`);
export const fetchArchive   = () => request<any[]>("/archive");
export const fetchIssue     = (id: number) => request<any>(`/archive/${id}`);
export const subscribe      = (email: string) =>
  request<{ message: string }>("/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  request<{ access_token: string }>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  });

export const fetchPendingArticles = (token: string, status = "pending") =>
  request<any[]>(`/admin/articles?status=${status}`, { headers: authHeader(token) });

export const approveArticle = (token: string, id: number, note: string, tags: string[]) =>
  request<any>(`/admin/articles/${id}/approve`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ clinical_relevance_note: note, tags }),
  });

export const rejectArticle = (token: string, id: number) =>
  request<any>(`/admin/articles/${id}/reject`, { method: "PATCH", headers: authHeader(token) });

export const fetchAdminTutorials = (token: string) =>
  request<any[]>("/admin/tutorials", { headers: authHeader(token) });

export const createTutorial = (token: string, data: any) =>
  request<any>("/admin/tutorials", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });

export const updateTutorial = (token: string, id: number, data: any) =>
  request<any>(`/admin/tutorials/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(data) });

export const deleteTutorial = (token: string, id: number) =>
  request<void>(`/admin/tutorials/${id}`, { method: "DELETE", headers: authHeader(token) });

export const fetchAdminNewsletters = (token: string) =>
  request<any[]>("/admin/newsletters", { headers: authHeader(token) });

export const createNewsletter = (token: string, data: any) =>
  request<any>("/admin/newsletters", { method: "POST", headers: authHeader(token), body: JSON.stringify(data) });

export const sendNewsletter = (token: string, id: number) =>
  request<any>(`/admin/newsletters/${id}/send`, { method: "POST", headers: authHeader(token) });

export const fetchAdminSubscribers = (token: string) =>
  request<any[]>("/admin/subscribers", { headers: authHeader(token) });
