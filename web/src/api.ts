const base = import.meta.env.VITE_API ?? "http://localhost:3000"

interface Init { method?: string; body?: unknown }

export const token = () => localStorage.getItem("token")
export const who = () => localStorage.getItem("name") ?? ""
export const login = (res: { token: string; name: string }) => { localStorage.setItem("token", res.token); localStorage.setItem("name", res.name) }
export const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("name") }
export const msg = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong")

const errorText = (data: unknown) => (typeof data === "object" && data && "error" in data && typeof data.error === "string" ? data.error : "Please check the details and try again")

export async function api<T>(path: string, { method = "GET", body }: Init = {}): Promise<T> {
  const res = await fetch(base + path, {
    method,
    headers: { "content-type": "application/json", ...(token() ? { authorization: `Bearer ${token()}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => null)
  if (!res) throw new Error("Cannot reach the server, please try again")
  const data: unknown = await res.json().catch(() => null)
  if (res.status === 401 && path !== "/auth/login") { logout(); location.assign("/login") }
  if (!res.ok) throw new Error(errorText(data))
  return data as T
}
