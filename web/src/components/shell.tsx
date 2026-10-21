import { Link, Navigate, Outlet, useNavigate } from "react-router"
import { logout, token, who } from "@/api"

export default function Shell() {
  const nav = useNavigate()
  if (!token()) return <Navigate to="/login" replace />
  const out = () => { logout(); void nav("/login") }
  return <div className="min-h-screen">
    <header className="border-b border-edge">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight">The Date Crew <span className="hidden font-normal text-gold sm:inline">Matchmaker Desk</span></Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-white/70 sm:inline">{who()}</span>
          <button onClick={out} className="rounded-full cursor-pointer border border-edge px-4 py-1.5 text-sm transition-colors duration-200 hover:border-gold">Log out</button>
        </div>
      </div>
    </header>
    <Outlet />
  </div>
}
