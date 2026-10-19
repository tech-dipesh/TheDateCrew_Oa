import "dotenv/config"
import { z } from "zod"
const schema = z.object({ DB_URL: z.string("Please enter a DB_URL"), JWTKEY: z.string("Please enter a JWTKEY"), PORT: z.coerce.number().default(3000) })
const parsed = schema.safeParse(process.env)
if (!parsed.success) {
    console.error("please enter these env keys, they are missing or invalid and the server won't work:", Object.keys(z.flattenError(parsed.error).fieldErrors))
    process.exit(1)
}
export const env = parsed.data
