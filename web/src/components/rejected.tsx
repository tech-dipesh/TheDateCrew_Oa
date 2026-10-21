import { Alert } from "@/components/bits"
import type { RejectedList } from "@/types"
import { useApi } from "@/useapi"

const names: Record<string, string> = { age: "Age", income: "Income", height: "Height", kids: "Children", score: "Low overall score", place: "Location", work: "Profession", edu: "Education", pets: "Pets", lang: "Language", marital: "Marital status", community: "Community" }

export default function Rejected({ id, q }: { id: string; q: string }) {
  const { data, error, loading } = useApi<RejectedList>(`/customers/${id}/matches/rejected${q}`)
  const counts = Object.entries(data?.summary ?? {})
  const top = counts.toSorted((a, b) => b[1] - a[1]).slice(0, 4)
  return <div className="mt-4 rounded-card bg-raised p-6 shadow-card">
    <h3 className="text-sm font-medium uppercase tracking-wide text-gold">Why not matched</h3>
    {loading && <p className="mt-3 text-white/70">Checking the rest of the pool...</p>}
    {error && <div className="mt-3"><Alert text={error} /></div>}
    {data && <>
      <p className="mt-3 text-white/70">{data.total} profiles were left out. Most common reasons: {top.map(([key, n]) => `${names[key] ?? key} (${n})`).join(", ") || "none"}.</p>
      <p className="mt-1 text-sm text-white/70">Showing the {data.rejected.length} closest misses.</p>
      <ul className="mt-4 space-y-3">
        {data.rejected.map((m) => <li key={m.id} className="border-t border-edge pt-3">
          <p className="font-medium">{m.firstName} {m.lastName}, {m.age} <span className="font-normal text-white/70">{m.city}, score {m.score}</span></p>
          <ul className="mt-1 text-sm text-white/70">
            {m.why.map((w) => <li key={w.text}>{w.text}</li>)}
          </ul>
        </li>)}
      </ul>
    </>}
  </div>
}
