import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { env } from "@/infra/env"
import { fail } from "@/infra/catch"

declare module "express-serve-static-core" {
    interface Request { mid: string }
}

const tokenSchema = z.object({ id: z.string() })

export const auth: RequestHandler = (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1] ?? ""
    try { req.mid = tokenSchema.parse(jwt.verify(token, env.JWTKEY)).id } catch { throw fail(401, "please login first") }
    next()
}
