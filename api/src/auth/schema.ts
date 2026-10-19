import { z } from "zod"
import { req } from "@/infra/validate"

export const loginSchema = z.object({ username: req("username"), password: req("password") })
export type Login = z.infer<typeof loginSchema>
