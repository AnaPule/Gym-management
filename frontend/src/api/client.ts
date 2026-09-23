/**
 * @file        client.ts
 * @description Thin fetch wrapper. No backend yet — every call currently
 *              simulates a network round-trip so the UI can be developed
 *              end to end before Rails lands.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 *
 * TODO: point BASE_URL at import.meta.env.VITE_API_URL once the API exists.
 */
const BASE_URL = ''; // TODO: wire to import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any, message?: string) {
    super(message || body?.message || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  simulate: { data?: T; delay?: number } = {}
): Promise<T> {
  if (!BASE_URL) {
    // Stub mode — no backend. Simulate a network round-trip.
    await new Promise((r) => setTimeout(r, simulate.delay ?? 500));
    return (simulate.data ?? ({} as T));
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}