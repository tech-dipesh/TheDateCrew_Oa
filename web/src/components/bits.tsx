import { nice } from "@/text"
import type { ReactNode } from "react"

const box = "w-full border border-edge bg-black/40 px-5 py-2.5 text-white placeholder:text-white/50"
export const field = `${box} rounded-full`
export const area = `${box} rounded-3xl`
export const solid = "rounded-full bg-amber px-5 py-2.5 font-medium text-black transition-colors duration-200 hover:bg-gold disabled:opacity-50"

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-card bg-raised p-6 shadow-card">
    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gold">{title}</h2>
    {children}
  </section>
}

export function Row({ label, value }: { label: string; value: string | number }) {
  return <div className="flex justify-between gap-6 border-b border-edge py-2 last:border-0">
    <dt className="shrink-0 text-white/70">{label}</dt>
    <dd className="min-w-0 wrap-break-word text-right">{value}</dd>
  </div>
}

export const Badge = ({ stage }: { stage: string }) => <span className="inline-flex rounded-full border border-gold/60 px-3 py-1 text-xs font-medium text-gold">{nice(stage)}</span>

export const Alert = ({ text }: { text: string }) => <p role="alert" className="rounded-card border border-gold/60 px-5 py-3 text-gold">{text}</p>
