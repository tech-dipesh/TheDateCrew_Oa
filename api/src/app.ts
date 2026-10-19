import express from "express"
import cors from "cors"
import { errorHandler } from "@/infra/catch"
export const app = express()
app.use(cors(), express.json())
app.get("/health", (_req, res) => res.json({ ok: true }))
app.use((_req, res) => res.status(404).json({ error: "route not found" }))
app.use(errorHandler)
