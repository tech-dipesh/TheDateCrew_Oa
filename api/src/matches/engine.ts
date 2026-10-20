import type { Profile } from "@/generated/prisma/client"
import { ageOf } from "@/infra/age"
import { roleFit } from "@/matches/roles"
import { bandFit, choiceFit, communityFit, eduFit, incomeFit, langFit, maleFilters, placeFit } from "@/matches/rules"
import type { Why } from "@/matches/rules"

export interface Scored {
    profile: Profile
    age: number
    score: number
    label: string
    reasons: string[]
    concerns: string[]
    why: Why[]
}

interface Part { key: string; w: number; score: number }

const MIN = 60

const good: Record<string, string> = {
    kids: "Same view on children",
    age: "Comfortable age gap",
    place: "Easy to meet, same city or open to relocate",
    work: "Compatible professions",
    edu: "Similar education",
    pets: "Aligned on pets",
    lang: "Shares a language",
    marital: "Same marital history",
    income: "Comparable income",
    community: "Same community",
}

const weak: Record<string, string> = {
    kids: "Different views on children",
    age: "Age gap is outside the sweet spot",
    place: "Distance or relocation could be hard",
    work: "Professions are far apart",
    edu: "Education levels differ",
    pets: "Different views on pets",
    lang: "No shared regional language",
    marital: "Different marital history",
    income: "Income gap",
    community: "Different community",
}

const labelOf = (score: number) => (score >= 82 ? "High potential match" : score >= 70 ? "Good fit" : "Worth a look")

const parts = (c: Profile, p: Profile, community: boolean) => {
    const male = c.gender === "MALE"
    const gap = male ? ageOf(c.dob) - ageOf(p.dob) : ageOf(p.dob) - ageOf(c.dob)
    const list: Part[] = [
        { key: "kids", w: male ? 0.25 : 0.2, score: choiceFit(c.wantKids, p.wantKids) },
        { key: "age", w: male ? 0.2 : 0.15, score: bandFit(gap, 1, male ? 5 : 6) },
        { key: "place", w: 0.15, score: placeFit(c, p) },
        { key: "work", w: male ? 0.1 : 0.15, score: roleFit(c.designation, p.designation) },
        { key: "edu", w: 0.1, score: eduFit(c, p) },
        { key: "pets", w: 0.05, score: choiceFit(c.pets, p.pets) },
        { key: "lang", w: 0.05, score: langFit(c, p) },
        { key: "marital", w: 0.05, score: c.marital === p.marital ? 1 : 0.4 },
    ]
    if (!male) list.push({ key: "income", w: 0.1, score: incomeFit(c.incomeLpa, p.incomeLpa) })
    if (community) list.push({ key: "community", w: 0.15, score: communityFit(c, p) })
    return list
}

const scoreOne = (c: Profile, p: Profile, community: boolean): Scored => {
    const list = parts(c, p, community)
    const total = list.reduce((sum, x) => sum + x.w * x.score, 0)
    const weight = list.reduce((sum, x) => sum + x.w, 0)
    const score = Math.round((100 * total) / weight)
    const strong = list.filter((x) => x.score >= 0.8)
    const best = strong.toSorted((a, b) => b.w - a.w).slice(0, 4)
    const reasons = best.map((x) => (x.key === "place" && c.city === p.city ? `Both in ${p.city}` : good[x.key]))
    const lows = list.filter((x) => x.score < 0.6)
    const low = lows.toSorted((a, b) => a.score - b.score).slice(0, 3)
    const concerns = low.map((x) => weak[x.key])
    const hard = c.gender === "MALE" ? maleFilters(c, p, ageOf(c.dob), ageOf(p.dob)) : []
    const soft = low.map((x): Why => ({ key: x.key, text: weak[x.key] }))
    const cut: Why[] = score < MIN ? [{ key: "score", text: `Overall score ${score} is below the ${MIN} cutoff` }, ...soft] : []
    return { profile: p, age: ageOf(p.dob), score, label: labelOf(score), reasons, concerns, why: hard.length ? hard : cut }
}

export const rank = (customer: Profile, pool: Profile[], community: boolean) => {
    const scored = pool.map((p) => scoreOne(customer, p, community))
    const fits = scored.filter((s) => s.why.length === 0)
    const misses = scored.filter((s) => s.why.length > 0)
    const matches = fits.toSorted((a, b) => b.score - a.score)
    const rejected = misses.toSorted((a, b) => a.why.length - b.why.length || b.score - a.score)
    return { matches, rejected }
}
