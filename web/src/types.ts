export const STAGES = ["ONBOARDING", "VERIFIED", "MATCHES_SUGGESTED", "IN_CONVERSATION", "MEETING_SCHEDULED", "CLOSED"] as const
export type Stage = (typeof STAGES)[number]
export type Choice = "YES" | "NO" | "MAYBE"

export interface Listed { id: string; firstName: string; lastName: string; dob: string; age: number; city: string; marital: string; stage: Stage }
