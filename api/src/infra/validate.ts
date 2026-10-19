import type { NextFunction, Request, Response } from "express"
import { z } from "zod"

export const validate = (schema: z.ZodType, key: "body" | "params" | "query" = "body") => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[key])
    if (!parsed.success) { res.status(400).json({ error: z.flattenError(parsed.error) }); return }
    if (key === "body") req.body = parsed.data
    next()
}

export const req = (name: string) => z.string(`Please enter a ${name}`).trim().min(1, `Please enter a ${name}`)
