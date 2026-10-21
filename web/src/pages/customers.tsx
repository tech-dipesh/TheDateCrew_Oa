import { useState } from "react"
import { Link } from "react-router"
import { Alert, Badge, field, Page } from "@/components/bits"
import { nice } from "@/text"
import { STAGES } from "@/types"
import type { Listed } from "@/types"
import { useApi } from "@/useapi"

const cols = "md:grid-cols-[2fr_0.6fr_1.4fr_1.4fr_1.6fr]"

export default function Customers() {
  const { data, error, loading } = useApi<Listed[]>("/customers")
  const [q, setQ] = useState("")
  const [stage, setStage] = useState("")
  const term = q.trim().toLowerCase()
  const shown = data?.filter((c) => (!stage || c.stage === stage) && `${c.firstName} ${c.lastName} ${c.city}`.toLowerCase().includes(term))
  return <Page>
    <h1 className="text-3xl font-semibold tracking-tight">Your clients</h1>
    <p className="mt-1 mb-6 text-white/70">{data ? `${data.length} assigned to you` : "Everyone you are matching right now"}</p>
    {loading && <p className="text-white/70">Loading your clients...</p>}
    {error && <Alert text={error} />}
    {data && !data.length && <p className="text-white/70">No clients are assigned to you yet.</p>}
    {!!data?.length && <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="q" className="sr-only">Search clients</label>
        <input id="q" type="search" value={q} onChange={(e) => { setQ(e.target.value) }} placeholder="Search by name or city" className={field} />
        <label htmlFor="st" className="sr-only">Filter by stage</label>
        <select id="st" value={stage} onChange={(e) => { setStage(e.target.value) }} className={`${field} sm:w-64`}>
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{nice(s)}</option>)}
        </select>
      </div>
      {!shown?.length && <p className="text-white/70">No client matches that search.</p>}
      {!!shown?.length && <div className={`hidden gap-x-4 px-6 pb-2 text-sm text-white/70 md:grid ${cols}`}>
        <span>Name</span><span>Age</span><span>City</span><span>Marital status</span><span>Status</span>
      </div>}
      <ul className="space-y-3">
        {shown?.map((c) => <li key={c.id}>
          <Link to={`/customers/${c.id}`} className={`grid grid-cols-2 items-center gap-x-4 gap-y-1 rounded-card border border-transparent bg-raised px-6 py-4 shadow-card transition-colors duration-200 hover:border-gold/60 ${cols}`}>
            <span className="col-span-2 text-lg font-medium md:col-span-1">{c.firstName} {c.lastName}</span>
            <span className="text-white/70">{c.age} yrs</span>
            <span className="text-white/70">{c.city}</span>
            <span className="text-white/70">{nice(c.marital)}</span>
            <span className="justify-self-start"><Badge stage={c.stage} /></span>
          </Link>
        </li>)}
      </ul>
    </>}
  </Page>
}
