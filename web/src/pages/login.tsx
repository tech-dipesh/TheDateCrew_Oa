import { useState } from "react"
import type { SubmitEvent } from "react"
import { Navigate, useNavigate } from "react-router"
import { api, login, msg, token } from "@/api"
import { field, solid } from "@/components/bits"

export default function Login() {
  const nav = useNavigate()
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  if (token()) return <Navigate to="/" replace />
  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try { login(await api<{ token: string; name: string }>("/auth/login", { method: "POST", body: { username: user.trim(), password: pass } })); void nav("/") } catch (err) { setError(msg(err)) } finally { setBusy(false) }
  }
  return <main className="grid min-h-screen place-items-center px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-card bg-raised p-8 shadow-card">
      <p className="text-sm font-medium uppercase tracking-wide text-gold">The Date Crew</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Matchmaker Desk</h1>
      <p className="mt-2 text-white/70">Sign in to see your clients and their best matches.</p>
      <label htmlFor="user" className="mt-6 block text-sm">Username</label>
      <input id="user" value={user} onChange={(e) => { setUser(e.target.value) }} autoComplete="username" required className={`${field} mt-1`} />
      <label htmlFor="pass" className="mt-4 block text-sm">Password</label>
      <input id="pass" type="password" value={pass} onChange={(e) => { setPass(e.target.value) }} autoComplete="current-password" required className={`${field} mt-1`} />
      {error && <p role="alert" className="mt-4 text-gold">{error}</p>}
      <button disabled={busy} className={`${solid} mt-6 w-full`}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
  </main>
}
