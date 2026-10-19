import { app } from "@/app"
import { env } from "@/infra/env"

if (!process.env.VERCEL) app.listen(env.PORT, () => { console.log("api on", env.PORT) })
export default app
