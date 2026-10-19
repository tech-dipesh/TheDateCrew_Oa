import express from "express"
import cors from "cors"
import { auth } from "@/infra/auth"
import { errorHandler } from "@/infra/catch"
import { authRouter } from "@/auth/routes"
import { customerRouter } from "@/customers/routes"
import { matchRouter } from "@/matches/routes"

export const app = express()
app.use(cors(), express.json())
app.get("/health", (_req, res) => res.json({ ok: true }))
app.use("/auth", authRouter)
app.use("/customers/:id/matches", auth, matchRouter)
app.use("/customers", auth, customerRouter)
app.use((_req, res) => res.status(404).json({ error: "route not found" }))
app.use(errorHandler)
