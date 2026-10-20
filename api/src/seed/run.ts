import bcrypt from "bcryptjs"
import { db } from "@/db"
import { buildProfiles, MAKERS, PASSWORD } from "@/seed/data"

await db.sentMatch.deleteMany()
await db.note.deleteMany()
await db.profile.deleteMany()
await db.matchmaker.deleteMany()
const password = await bcrypt.hash(PASSWORD, 10)
const makers = await Promise.all(MAKERS.map((m) => db.matchmaker.create({ data: { ...m, password } })))
const { count } = await db.profile.createMany({ data: buildProfiles(makers.map((m) => m.id)) })
console.log("seeded", count, "profiles, logins:", MAKERS.map((m) => m.username).join(", "), "/", PASSWORD)
await db.$disconnect()
