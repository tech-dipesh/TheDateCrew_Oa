import { z } from "zod"
import type { Profile } from "@/generated/prisma/client"
import { ageOf } from "@/infra/age"
import { env } from "@/infra/env"
import type { Scored } from "@/matches/engine"

const reply = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1) })
const notes = z.record(z.string(), z.string())

const system = "You help a matchmaker at an Indian matrimonial service. You get a client and ranked candidates with a computed compatibility score, strengths and concerns. For each candidate write 1 or 2 warm, specific sentences on why they could suit the client, and name one honest concern if there is one. Use only the facts given, never invent details, never change the score. Reply with JSON only: an object mapping each candidate id to its text."

const brief = (p: Profile) => ({
    name: p.firstName,
    age: ageOf(p.dob),
    city: p.city,
    country: p.country,
    heightCm: p.heightCm,
    education: `${p.degree}, ${p.college}`,
    job: `${p.designation} at ${p.company}`,
    incomeLpa: p.incomeLpa,
    religion: p.religion,
    wantsKids: p.wantKids,
    openToRelocate: p.relocate,
    openToPets: p.pets,
    languages: p.languages,
})

export const explain = async (customer: Profile, top: Scored[]) => {
    const key = env.GROQKEY
    if (!key) return new Map<string, string>()
    const candidates = top.map((s) => ({ id: s.profile.id, ...brief(s.profile), score: s.score, strengths: s.reasons, concerns: s.concerns }))
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                temperature: 0.4,
                reasoning_effort: "low",
                max_completion_tokens: 2500,
                response_format: { type: "json_object" },
                messages: [{ role: "system", content: system }, { role: "user", content: JSON.stringify({ client: brief(customer), candidates }) }],
            }),
            signal: AbortSignal.timeout(20000),
        })
        if (!res.ok) return new Map<string, string>()
        const { choices } = reply.parse(await res.json())
        return new Map(Object.entries(notes.parse(JSON.parse(choices[0].message.content))))
    } catch {
        return new Map<string, string>()
    }
}
