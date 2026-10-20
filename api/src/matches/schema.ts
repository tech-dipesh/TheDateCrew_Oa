import { z } from "zod"

export const querySchema = z.object({ community: z.enum(["true", "false"], "community must be true or false").optional() })
export const sendSchema = z.object({ id: z.uuid("Invalid customer id"), matchId: z.uuid("Invalid match id") })
