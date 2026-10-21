export const nice = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replaceAll("_", " ")
export const day = (s: string) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
export const stamp = (s: string) => new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
