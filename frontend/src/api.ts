const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export type Profile = { username: string; first_name: string; last_name: string; role: 'Admin' | 'Teacher' | 'Student'; student_id: string | null };
export type Computer = { id: number; computer_id: string; name: string; location: string; is_active: boolean; status: string; active_student: string | null; active_login_at: string | null };
export type LabSession = { id: number; student_username: string; computer_id: string; login_at: string; logout_at: string | null; is_active: boolean };
export type DashboardStats = { total_computers: number; active_computers: number; occupied_computers: number; active_sessions: number; registered_students: number };

export function getToken() { return localStorage.getItem('labguard_access'); }
export function saveTokens(access: string, refresh: string) { localStorage.setItem('labguard_access', access); localStorage.setItem('labguard_refresh', refresh); }
export function clearTokens() { localStorage.removeItem('labguard_access'); localStorage.removeItem('labguard_refresh'); }

async function request<T>(path: string, options: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (auth && token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail || data.message || Object.values(data).flat().join(' ') || `Request failed (${response.status})`;
    throw new Error(String(detail));
  }
  return data as T;
}

export async function login(username: string, password: string) {
  const tokens = await request<{access: string; refresh: string}>('/auth/token/', { method: 'POST', body: JSON.stringify({ username, password }) }, false);
  saveTokens(tokens.access, tokens.refresh);
  try { return await me(); } catch (error) { clearTokens(); throw error; }
}
export function registerStudent(payload: {username: string; password: string; confirm_password: string; student_id: string; first_name: string; last_name: string}) {
  return request<{message: string; username: string}>('/auth/register/', { method: 'POST', body: JSON.stringify(payload) }, false);
}
export function me() { return request<Profile>('/me/'); }
export function getComputers() { return request<Computer[]>('/computers/'); }
export function getStudents() { return request<Profile[]>('/students/'); }
export function getSessions() { return request<LabSession[]>('/sessions/'); }
export function getMyActiveSession() { return request<LabSession | null>('/sessions/mine/'); }
export function getDashboard() { return request<DashboardStats>('/dashboard/'); }
export function startSession(computer_id: string) { return request<LabSession>('/sessions/start/', { method: 'POST', body: JSON.stringify({ computer_id }) }); }
export function endSession(session_id?: number) { return request<{message: string}>('/sessions/end/', { method: 'POST', body: JSON.stringify(session_id ? { session_id } : {}) }); }

export async function detectComputerId(): Promise<string | null> {
  const agentUrl = import.meta.env.VITE_PC_AGENT_URL || 'http://127.0.0.1:8765/pc-id';
  try {
    const response = await fetch(agentUrl, { method: 'GET', cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.computer_id === 'string' && data.computer_id.trim() ? data.computer_id.trim() : null;
  } catch { return null; }
}
