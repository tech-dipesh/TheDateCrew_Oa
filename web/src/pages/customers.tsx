import { Link } from "react-router"
import { Alert, Badge, Page } from "@/components/bits"
import { nice } from "@/text"
import type { Listed } from "@/types"
import { useApi } from "@/useapi"

const cols = "md:grid-cols-[2fr_0.6fr_1.4fr_1.4fr_1.6fr]"

export default function Customers() {
  const { data, error, loading } = useApi<Listed[]>("/customers")
  return <Page>
    <h1 className="text-3xl font-semibold tracking-tight">Your clients</h1>
    <p className="mt-1 mb-6 text-white/70">{data ? `${data.length} assigned to you` : "Everyone you are matching right now"}</p>
    {loading && <p className="text-white/70">Loading your clients...</p>}
    {error && <Alert text={error} />}
    {data && !data.length && <p className="text-white/70">No clients are assigned to you yet.</p>}
    {!!data?.length && <>
      <div className={`hidden gap-x-4 px-6 pb-2 text-sm text-white/70 md:grid ${cols}`}>
        <span>Name</span><span>Age</span><span>City</span><span>Marital status</span><span>Status</span>
      </div>
      <ul className="space-y-3">
        {data.map((c) => <li key={c.id}>
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
