import { Router } from "express"
import { db } from "@/db"
import { withCatch } from "@/infra/catch"
import { validate } from "@/infra/validate"
import { ageOf } from "@/infra/age"
import { findOwn } from "@/customers/service"
import { idSchema, noteSchema, stageSchema } from "@/customers/schema"
import type { NoteBody, StageBody } from "@/customers/schema"

export const customerRouter = Router()

customerRouter.get("/", withCatch(async (req, res) => {
    const customers = await db.profile.findMany({
        where: { matchmakerId: req.mid },
        select: { id: true, firstName: true, lastName: true, dob: true, city: true, marital: true, stage: true },
        orderBy: { firstName: "asc" },
    })
    res.json(customers.map((c) => ({ ...c, age: ageOf(c.dob) })))
}))

customerRouter.get("/:id", validate(idSchema, "params"), withCatch(async (req, res) => {
    const customer = await findOwn(req.params.id, req.mid)
    res.json({ ...customer, age: ageOf(customer.dob) })
}))

customerRouter.patch("/:id/stage", validate(idSchema, "params"), validate(stageSchema), withCatch<StageBody>(async (req, res) => {
    const { id } = req.params
    await findOwn(id, req.mid)
    const { stage } = await db.profile.update({ where: { id }, data: { stage: req.body.stage } })
    res.json({ id, stage })
}))

customerRouter.get("/:id/notes", validate(idSchema, "params"), withCatch(async (req, res) => {
    const { id } = req.params
    await findOwn(id, req.mid)
    res.json(await db.note.findMany({ where: { profileId: id }, orderBy: { createdAt: "desc" } }))
}))

customerRouter.post("/:id/notes", validate(idSchema, "params"), validate(noteSchema), withCatch<NoteBody>(async (req, res) => {
    const { id } = req.params
    await findOwn(id, req.mid)
    const note = await db.note.create({ data: { profileId: id, matchmakerId: req.mid, text: req.body.text } })
    res.status(201).json(note)
}))
