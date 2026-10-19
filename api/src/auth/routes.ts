import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "@/db"
import { env } from "@/infra/env"
import { fail, withCatch } from "@/infra/catch"
import { validate } from "@/infra/validate"
import { loginSchema } from "@/auth/schema"
import type { Login } from "@/auth/schema"

export const authRouter = Router()

authRouter.post("/login", validate(loginSchema), withCatch<Login>(async (req, res) => {
    const { username, password } = req.body
    const user = await db.matchmaker.findUnique({ where: { username } })
    if (!user || !(await bcrypt.compare(password, user.password))) throw fail(401, "wrong username or password")
    const token = jwt.sign({ id: user.id }, env.JWTKEY, { expiresIn: "7d" })
    res.json({ token, name: user.name })
}))
