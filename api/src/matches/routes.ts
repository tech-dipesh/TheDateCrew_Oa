import { Router } from "express"
import { db } from "@/db"
import { idSchema } from "@/customers/schema"
import { findOwn } from "@/customers/service"
import { fail, withCatch } from "@/infra/catch"
import { validate } from "@/infra/validate"
import { explain } from "@/matches/ai"
import { querySchema, sendSchema } from "@/matches/schema"
import { card, mockEmail, run } from "@/matches/service"

export const matchRouter = Router({ mergeParams: true })

matchRouter.get("/", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req, res) => {
    const { id } = req.params
    const { matches, rejected } = await run(id, req.mid, req.query.community === "true")
    const sent = await db.sentMatch.findMany({ where: { customerId: id }, select: { matchId: true } })
    const done = new Set(sent.map((s) => s.matchId))
    const top = matches.slice(0, 10)
    res.json({ eligible: matches.length, rejected: rejected.length, matches: top.map((s) => card(s, done.has(s.profile.id))) })
}))

matchRouter.get("/explain", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req, res) => {
    const { customer, matches } = await run(req.params.id, req.mid, req.query.community === "true")
    const top = matches.slice(0, 10)
    const notes = await explain(customer, top)
    const texts = top.map((s): [string, string] => [s.profile.id, notes.get(s.profile.id) ?? s.reasons.join(". ")])
    res.json({ source: notes.size ? "groq" : "rules", notes: Object.fromEntries(texts) })
}))

matchRouter.get("/rejected", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req, res) => {
    const { rejected } = await run(req.params.id, req.mid, req.query.community === "true")
    const keys = rejected.flatMap((s) => s.why.map((w) => w.key))
    const summary = keys.reduce<Record<string, number>>((all, key) => ({ ...all, [key]: (all[key] ?? 0) + 1 }), {})
    const near = rejected.slice(0, 30)
    res.json({ total: rejected.length, summary, rejected: near.map((s) => ({ ...card(s), why: s.why })) })
}))

matchRouter.post("/:matchId/send", validate(sendSchema, "params"), withCatch(async (req, res) => {
    const { id, matchId } = req.params
    const customer = await findOwn(id, req.mid)
    const match = await db.profile.findUnique({ where: { id: matchId } })
    if (!match || match.gender === customer.gender) throw fail(404, "match not found")
    const done = await db.sentMatch.findUnique({ where: { customerId_matchId: { customerId: id, matchId } } })
    if (done) throw fail(409, "this match was already sent")
    const maker = await db.matchmaker.findUniqueOrThrow({ where: { id: req.mid } })
    await db.sentMatch.create({ data: { customerId: id, matchId, matchmakerId: req.mid } })
    res.status(201).json(mockEmail(customer, match, maker.name))
}))
