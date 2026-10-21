import { useState } from "react"
import { Link, useParams } from "react-router"
import { api, msg } from "@/api"
import { Alert, Card, field, Page, Row } from "@/components/bits"
import Matches from "@/components/matches"
import Notes from "@/components/notes"
import { day, nice } from "@/text"
import { STAGES } from "@/types"
import type { Profile } from "@/types"
import { useApi } from "@/useapi"

type Group = [string, [string, string | number][]]

export default function Customer() {
  const { id = "" } = useParams()
  const { data: p, error, loading, reload } = useApi<Profile>(`/customers/${id}`)
  const [saving, setSaving] = useState(false)
  const [fail, setFail] = useState("")
  if (loading) return <Page><p className="text-white/70">Loading profile...</p></Page>
  if (!p) return <Page><Alert text={error} /><Link to="/" className="mt-4 inline-block text-gold">Back to clients</Link></Page>
  const setStage = async (value: string) => {
    const stage = STAGES.find((s) => s === value)
    if (!stage) return
    setSaving(true)
    setFail("")
    try { await api(`/customers/${id}/stage`, { method: "PATCH", body: { stage } }); reload() } catch (err) { setFail(msg(err)) } finally { setSaving(false) }
  }
  const groups: Group[] = [
    ["Personal", [["Gender", nice(p.gender)], ["Date of birth", day(p.dob)], ["Height", `${p.heightCm} cm`], ["Location", `${p.city}, ${p.country}`], ["Marital status", nice(p.marital)], ["Languages", p.languages.join(", ")], ["Siblings", p.siblings]]],
    ["Contact", [["Email", p.email], ["Phone", p.phone]]],
    ["Education and work", [["College", p.college], ["Degree", p.degree], ["Company", p.company], ["Designation", p.designation], ["Income", `${p.incomeLpa} LPA`]]],
    ["Community", [["Religion", p.religion], ["Caste", p.caste]]],
    ["Preferences", [["Wants kids", nice(p.wantKids)], ["Open to relocate", nice(p.relocate)], ["Open to pets", nice(p.pets)]]],
  ]
  return <Page>
    <Link to="/" className="text-sm text-gold">Back to clients</Link>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{p.firstName} {p.lastName}</h1>
        <p className="mt-1 text-white/70">{p.age} yrs, {p.designation} at {p.company}, {p.city}</p>
      </div>
      <div>
        <label htmlFor="stage" className="mb-1 block text-sm text-white/70">Journey stage</label>
        <select id="stage" value={p.stage} disabled={saving} onChange={(e) => void setStage(e.target.value)} className={`${field} w-auto`}>
          {STAGES.map((s) => <option key={s} value={s}>{nice(s)}</option>)}
        </select>
      </div>
    </div>
    {fail && <div className="mt-4"><Alert text={fail} /></div>}
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
      <div className="min-w-0 space-y-6">
        {groups.map(([title, rows]) => <Card key={title} title={title}>
          <dl>{rows.map(([label, value]) => <Row key={label} label={label} value={value} />)}</dl>
        </Card>)}
        <Notes id={id} />
      </div>
      <Matches id={id} />
    </div>
  </Page>
}
