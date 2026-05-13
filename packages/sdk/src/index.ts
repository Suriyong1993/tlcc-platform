// TLCC API SDK — shared client for mobile + admin
const BASE_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

export class TLCCClient {
  private token?: string;

  constructor(token?: string) { this.token = token; }

  setToken(token: string) { this.token = token; }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // Auth
  login(email: string, password: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(data: { email: string; username: string; password: string }) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  // Users
  getMe() { return this.request('/users/me'); }
  updateProfile(data: any) { return this.request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }); }

  // Events
  getEvents(params?: { page?: number; limit?: number; category?: string }) {
    const q = new URLSearchParams(params as any).toString();
    return this.request(`/events${q ? '?' + q : ''}`);
  }
  registerEvent(id: string, data: any) {
    return this.request(`/events/${id}/register`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Prayer
  getPrayers(params?: any) {
    const q = new URLSearchParams(params as any).toString();
    return this.request(`/prayers${q ? '?' + q : ''}`);
  }
  createPrayer(data: { content: string; category?: string; isPublic?: boolean }) {
    return this.request('/prayers', { method: 'POST', body: JSON.stringify(data) });
  }

  // Reports
  getReports(params?: any) {
    const q = new URLSearchParams(params as any).toString();
    return this.request(`/reports${q ? '?' + q : ''}`);
  }

  // Notifications
  getNotifications() { return this.request('/notifications'); }
  markAllRead() { return this.request('/notifications/mark-all-read', { method: 'POST' }); }
}

export const api = new TLCCClient();
