import { useState } from "react"
import type { SubmitEvent } from "react"
import { api, msg } from "@/api"
import { Alert, area, Card, solid } from "@/components/bits"
import { stamp } from "@/text"
import type { Note } from "@/types"
import { useApi } from "@/useapi"

export default function Notes({ id }: { id: string }) {
  const { data, error, loading, reload } = useApi<Note[]>(`/customers/${id}/notes`)
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState("")
  const add = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setFail("")
    try { await api(`/customers/${id}/notes`, { method: "POST", body: { text: text.trim() } }); setText(""); reload() } catch (err) { setFail(msg(err)) } finally { setBusy(false) }
  }
  return <Card title="Meeting notes">
    <form onSubmit={add}>
      <label htmlFor="note" className="sr-only">New note</label>
      <textarea id="note" rows={3} value={text} onChange={(e) => { setText(e.target.value) }} placeholder="Quick note from the call or meeting" className={area} />
      <button disabled={busy || !text.trim()} className={`${solid} mt-3`}>{busy ? "Saving..." : "Add note"}</button>
    </form>
    {(fail || error) && <div className="mt-4"><Alert text={fail || error} /></div>}
    {loading && <p className="mt-4 text-white/70">Loading notes...</p>}
    {data && !data.length && <p className="mt-4 text-white/70">No notes yet.</p>}
    <ul className="mt-4 space-y-3">
      {data?.map((n) => <li key={n.id} className="border-t border-edge pt-3">
        <p className="whitespace-pre-wrap">{n.text}</p>
        <p className="mt-1 text-xs text-white/70">{stamp(n.createdAt)}</p>
      </li>)}
    </ul>
  </Card>
}
