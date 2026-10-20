import type { Choice, Profile } from "@/generated/prisma/client"
import { degreeLevel } from "@/matches/roles"

export interface Why { key: string; text: string }

const open: Record<Choice, number> = { YES: 1, MAYBE: 0.5, NO: 0 }

export const choiceFit = (a: Choice, b: Choice) => (a === b ? 1 : a === "MAYBE" || b === "MAYBE" ? 0.6 : 0)

export const bandFit = (gap: number, lo: number, hi: number) => {
    const miss = gap < lo ? lo - gap : gap > hi ? gap - hi : 0
    return Math.max(0.1, 1 - 0.15 * miss)
}

export const placeFit = (a: Profile, b: Profile) => {
    if (a.city === b.city) return 1
    const willing = Math.max(open[a.relocate], open[b.relocate])
    return (a.country === b.country ? 0.3 : 0) + 0.7 * willing
}

export const langFit = (a: Profile, b: Profile) => (a.languages.some((l) => l !== "English" && b.languages.includes(l)) ? 1 : 0.4)

export const eduFit = (a: Profile, b: Profile) => Math.max(0, 1 - 0.4 * Math.abs(degreeLevel(a.degree) - degreeLevel(b.degree)))

export const communityFit = (a: Profile, b: Profile) => (a.religion === b.religion ? 0.5 : 0) + (a.caste === b.caste ? 0.5 : 0)

export const incomeFit = (own: number, other: number) => Math.min(1, other / own)

export const maleFilters = (c: Profile, p: Profile, ageC: number, ageP: number) => {
    const out: Why[] = []
    if (ageP >= ageC) out.push({ key: "age", text: `Age ${ageP} is not younger than ${ageC}` })
    if (p.incomeLpa >= c.incomeLpa) out.push({ key: "income", text: `Income ${p.incomeLpa} LPA is not below ${c.incomeLpa} LPA` })
    if (p.heightCm >= c.heightCm) out.push({ key: "height", text: `Height ${p.heightCm} cm is not below ${c.heightCm} cm` })
    if (choiceFit(c.wantKids, p.wantKids) === 0) out.push({ key: "kids", text: "Opposite views on children" })
    return out
}
