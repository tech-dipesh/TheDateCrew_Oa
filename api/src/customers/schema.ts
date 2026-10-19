import { z } from "zod"
import { Stage } from "@/generated/prisma/client"
import { req } from "@/infra/validate"

export const idSchema = z.object({ id: z.uuid("Invalid customer id") })
export const stageSchema = z.object({ stage: z.enum(Stage, "Please pick a valid stage") })
export const noteSchema = z.object({ text: req("note") })
export type StageBody = z.infer<typeof stageSchema>
export type NoteBody = z.infer<typeof noteSchema>
