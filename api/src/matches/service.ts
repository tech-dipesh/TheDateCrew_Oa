import { db } from "@/db"
import { findOwn } from "@/customers/service"
import type { Profile } from "@/generated/prisma/client"
import { ageOf } from "@/infra/age"
import { rank } from "@/matches/engine"
import type { Scored } from "@/matches/engine"

export const run = async (id: string, mid: string, community: boolean) => {
    const customer = await findOwn(id, mid)
    const pool = await db.profile.findMany({ where: { gender: customer.gender === "MALE" ? "FEMALE" : "MALE" } })
    return { customer, ...rank(customer, pool, community) }
}

export const card = (s: Scored, sent = false) => {
    const { email, phone, matchmakerId, createdAt, stage, dob, ...pub } = s.profile
    return { ...pub, age: s.age, score: s.score, label: s.label, reasons: s.reasons, concerns: s.concerns, sent }
}

export const mockEmail = (customer: Profile, match: Profile, maker: string) => {
    const intro = [`Hi ${customer.firstName},`, `${maker} from The Date Crew here. Based on what you shared with us, I think you two should meet.`]
    const profile = [
        `${match.firstName} ${match.lastName}, ${ageOf(match.dob)}, ${match.city}`,
        `Height: ${match.heightCm} cm`,
        `Education: ${match.degree}, ${match.college}`,
        `Work: ${match.designation} at ${match.company}`,
        `Languages: ${match.languages.join(", ")}`,
    ]
    const close = ["Reply to this email and I will set up an introduction.", `Warmly,\n${maker}`]
    return { to: customer.email, subject: `A match for you: ${match.firstName} from ${match.city}`, body: [...intro, profile.join("\n"), ...close].join("\n\n") }
}
