export const STAGES = ["ONBOARDING", "VERIFIED", "MATCHES_SUGGESTED", "IN_CONVERSATION", "MEETING_SCHEDULED", "CLOSED"] as const
export type Stage = (typeof STAGES)[number]
export type Choice = "YES" | "NO" | "MAYBE"

export interface Listed { id: string; firstName: string; lastName: string; dob: string; age: number; city: string; marital: string; stage: Stage }

export interface Profile extends Listed {
  gender: string
  country: string
  heightCm: number
  email: string
  phone: string
  college: string
  degree: string
  incomeLpa: number
  company: string
  designation: string
  languages: string[]
  siblings: number
  caste: string
  religion: string
  wantKids: Choice
  relocate: Choice
  pets: Choice
}

export interface Match {
  id: string
  firstName: string
  lastName: string
  age: number
  city: string
  country: string
  heightCm: number
  college: string
  degree: string
  incomeLpa: number
  company: string
  designation: string
  score: number
  label: string
  reasons: string[]
  concerns: string[]
  sent: boolean
}

export interface MatchList { eligible: number; rejected: number; matches: Match[] }
export interface Note { id: string; text: string; createdAt: string }
export interface Email { to: string; subject: string; body: string }
