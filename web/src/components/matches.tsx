import { useEffect, useRef, useState } from "react"
import { api, msg } from "@/api"
import { Alert, solid } from "@/components/bits"
import type { Email, MatchList } from "@/types"
import { useApi } from "@/useapi"

function MailDialog({ mail, onClose }: { mail: Email; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (!ref.current?.open) ref.current?.showModal() }, [])
  return <dialog ref={ref} onClose={onClose} aria-labelledby="mail-title" className="m-auto w-[min(92vw,34rem)] rounded-card bg-raised p-6 text-white shadow-card backdrop:bg-black/70">
    <p className="text-sm font-medium uppercase tracking-wide text-gold">Mock email, nothing was actually sent</p>
    <h2 id="mail-title" className="mt-2 text-xl font-semibold">{mail.subject}</h2>
    <p className="mt-1 text-sm text-white/70">To: {mail.to}</p>
    <pre className="mt-4 max-h-[50vh] overflow-auto whitespace-pre-wrap font-sans text-sm">{mail.body}</pre>
    <button onClick={() => { ref.current?.close() }} className={`${solid} mt-5`}>Done</button>
  </dialog>
}

export default function Matches({ id }: { id: string }) {
  const { data, error, loading, reload } = useApi<MatchList>(`/customers/${id}/matches`)
  const [mail, setMail] = useState<Email>()
  const [busy, setBusy] = useState("")
  const [fail, setFail] = useState("")
  const send = async (matchId: string) => {
    setBusy(matchId)
    setFail("")
    try { setMail(await api<Email>(`/customers/${id}/matches/${matchId}/send`, { method: "POST" })); reload() } catch (err) { setFail(msg(err)) } finally { setBusy("") }
  }
  return <section className="min-w-0">
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">Suggested matches</h2>
      {data && <p className="text-sm text-white/70">{data.eligible} eligible profiles</p>}
    </div>
    {loading && <p className="mt-4 text-white/70">Finding matches...</p>}
    {(fail || error) && <div className="mt-4"><Alert text={fail || error} /></div>}
    {data && !data.matches.length && <p className="mt-4 text-white/70">No eligible matches for this client right now.</p>}
    <ul className="mt-4 space-y-4">
      {data?.matches.map((m) => <li key={m.id} className="rounded-card bg-raised p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{m.firstName} {m.lastName}, {m.age}</h3>
            <p className="text-white/70">{m.designation} at {m.company}</p>
          </div>
          <span className="shrink-0 rounded-full bg-amber px-3 py-1 text-sm font-semibold text-black">{m.score}</span>
        </div>
        <p className="mt-2 text-sm text-white/70">{[`${m.city}, ${m.country}`, `${m.heightCm} cm`, `${m.incomeLpa} LPA`].join(" | ")}</p>
        <p className="text-sm text-white/70">{m.degree}, {m.college}</p>
        <p className="mt-3 text-sm font-medium text-gold">{m.label}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {m.reasons.map((r) => <li key={r} className="rounded-full border border-edge px-3 py-1 text-xs">{r}</li>)}
        </ul>
        {!!m.concerns.length && <p className="mt-3 text-sm text-white/70">Watch for: {m.concerns.join("; ")}</p>}
        <button onClick={() => void send(m.id)} disabled={m.sent || busy === m.id} className={`${solid} mt-5`}>{m.sent ? "Match sent" : busy === m.id ? "Sending..." : "Send Match"}</button>
      </li>)}
    </ul>
    {mail && <MailDialog mail={mail} onClose={() => { setMail(undefined) }} />}
  </section>
}
