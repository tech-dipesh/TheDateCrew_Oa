import type { Choice, Marital, Prisma, Stage } from "@/generated/prisma/client"
import { ROLES } from "@/matches/roles"
import type { Role } from "@/matches/roles"

export const MAKERS = [{ name: "Priya Nair", username: "priya" }, { name: "Arjun Mehta", username: "arjun" }]
export const PASSWORD = "match1234"

const REGIONS = {
    delhi: { cities: ["Delhi", "Gurugram", "Noida"], langs: ["Hindi", "Punjabi"] },
    pb: { cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Mohali"], langs: ["Punjabi", "Hindi"] },
    hp: { cities: ["Shimla", "Solan", "Chandigarh"], langs: ["Hindi", "Pahari"] },
    up: { cities: ["Lucknow", "Kanpur", "Dehradun", "Noida", "Varanasi"], langs: ["Hindi"] },
    raj: { cities: ["Jaipur", "Jodhpur", "Udaipur"], langs: ["Hindi", "Rajasthani"] },
    mp: { cities: ["Indore", "Bhopal"], langs: ["Hindi"] },
    mh: { cities: ["Mumbai", "Pune", "Nagpur"], langs: ["Marathi", "Hindi"] },
    gj: { cities: ["Ahmedabad", "Surat", "Vadodara"], langs: ["Gujarati", "Hindi"] },
    ka: { cities: ["Bengaluru", "Mysuru"], langs: ["Kannada"] },
    tn: { cities: ["Chennai", "Coimbatore"], langs: ["Tamil"] },
    kl: { cities: ["Kochi", "Thiruvananthapuram"], langs: ["Malayalam"] },
    tg: { cities: ["Hyderabad", "Visakhapatnam"], langs: ["Telugu", "Hindi"] },
    wb: { cities: ["Kolkata"], langs: ["Bengali", "Hindi"] },
}

type Region = keyof typeof REGIONS

interface Family { w: number; religion: string; caste: string; surnames: string[]; regions: Region[]; extra?: string }

const FAMILIES: Family[] = [
    { w: 3, religion: "Hindu", caste: "Brahmin", surnames: ["Sharma", "Mishra", "Joshi", "Trivedi", "Pandey", "Bhatt"], regions: ["delhi", "up", "mp", "raj", "pb", "hp"] },
    { w: 2, religion: "Hindu", caste: "Rajput", surnames: ["Chauhan", "Rathore", "Thakur", "Shekhawat"], regions: ["raj", "up", "hp", "delhi"] },
    { w: 3, religion: "Hindu", caste: "Agarwal", surnames: ["Agarwal", "Gupta", "Goyal", "Bansal"], regions: ["delhi", "up", "raj", "mp"] },
    { w: 2, religion: "Hindu", caste: "Khatri", surnames: ["Kapoor", "Malhotra", "Khanna", "Arora", "Mehra"], regions: ["pb", "delhi"] },
    { w: 2, religion: "Hindu", caste: "Jat", surnames: ["Malik", "Dahiya", "Hooda", "Chaudhary"], regions: ["delhi", "pb", "raj"] },
    { w: 2, religion: "Hindu", caste: "Kayastha", surnames: ["Srivastava", "Saxena", "Mathur"], regions: ["up", "delhi", "mp"] },
    { w: 2, religion: "Hindu", caste: "Maratha", surnames: ["Patil", "Deshmukh", "Jadhav", "Shinde"], regions: ["mh"] },
    { w: 2, religion: "Hindu", caste: "Iyer", surnames: ["Iyer", "Venkataraman", "Subramanian"], regions: ["tn", "ka"] },
    { w: 2, religion: "Hindu", caste: "Nair", surnames: ["Nair", "Menon", "Pillai"], regions: ["kl"] },
    { w: 2, religion: "Hindu", caste: "Reddy", surnames: ["Reddy"], regions: ["tg"] },
    { w: 1, religion: "Hindu", caste: "Kamma", surnames: ["Chowdary", "Naidu"], regions: ["tg"] },
    { w: 2, religion: "Hindu", caste: "Patel", surnames: ["Patel", "Desai"], regions: ["gj"] },
    { w: 2, religion: "Jain", caste: "Oswal", surnames: ["Shah", "Mehta", "Jain", "Kothari"], regions: ["gj", "mh", "raj"] },
    { w: 1, religion: "Hindu", caste: "Vokkaliga", surnames: ["Gowda"], regions: ["ka"] },
    { w: 1, religion: "Hindu", caste: "Lingayat", surnames: ["Hiremath", "Patil"], regions: ["ka"] },
    { w: 2, religion: "Hindu", caste: "Bengali Brahmin", surnames: ["Banerjee", "Chatterjee", "Mukherjee", "Bhattacharya"], regions: ["wb"] },
    { w: 1, religion: "Hindu", caste: "Bengali Kayastha", surnames: ["Ghosh", "Bose", "Dutta", "Sen"], regions: ["wb"] },
    { w: 1, religion: "Hindu", caste: "Kashmiri Pandit", surnames: ["Raina", "Koul", "Zutshi"], regions: ["delhi", "pb"] },
    { w: 1, religion: "Hindu", caste: "Rajput", surnames: ["Rana", "Katoch", "Thakur"], regions: ["hp"] },
    { w: 3, religion: "Sikh", caste: "Jat Sikh", surnames: ["Gill", "Sandhu", "Dhillon", "Brar", "Sidhu"], regions: ["pb", "delhi"], extra: "Punjabi" },
    { w: 1, religion: "Sikh", caste: "Khatri Sikh", surnames: ["Ahluwalia", "Bedi", "Sethi"], regions: ["pb", "delhi"], extra: "Punjabi" },
    { w: 2, religion: "Muslim", caste: "Sheikh", surnames: ["Sheikh", "Siddiqui", "Ansari"], regions: ["up", "delhi", "tg", "mh"], extra: "Urdu" },
    { w: 1, religion: "Muslim", caste: "Pathan", surnames: ["Khan", "Pathan"], regions: ["up", "delhi", "mh", "raj"], extra: "Urdu" },
    { w: 1, religion: "Muslim", caste: "Syed", surnames: ["Syed", "Naqvi", "Rizvi"], regions: ["up", "tg", "delhi"], extra: "Urdu" },
    { w: 1, religion: "Christian", caste: "Roman Catholic", surnames: ["D'Souza", "Fernandes", "Pereira", "Rodrigues"], regions: ["mh", "ka", "kl"] },
    { w: 1, religion: "Christian", caste: "Syrian Christian", surnames: ["Thomas", "Mathew", "Joseph", "George"], regions: ["kl"] },
]

interface Pool { M: string[]; F: string[] }

const HINDU: Pool = {
    M: ["Aarav", "Arjun", "Rohan", "Karan", "Vikram", "Rahul", "Aditya", "Siddharth", "Nikhil", "Varun", "Ankit", "Harsh", "Kunal", "Manish", "Pranav", "Tushar", "Yash", "Rishabh", "Mohit", "Gaurav", "Sameer", "Abhishek", "Deepak", "Naveen", "Vivek", "Akash", "Ishaan", "Kartik", "Tarun", "Shreyas", "Parth", "Dhruv"],
    F: ["Ananya", "Priya", "Neha", "Kavya", "Riya", "Sneha", "Pooja", "Isha", "Meera", "Tanvi", "Shruti", "Aditi", "Nisha", "Divya", "Sakshi", "Radhika", "Aishwarya", "Swati", "Pallavi", "Ritika", "Kritika", "Mansi", "Bhavna", "Nidhi", "Shreya", "Anjali", "Garima", "Komal", "Payal", "Vaishnavi", "Sanya", "Diya"],
}

const NAMES = new Map<string, Pool>([
    ["Sikh", { M: ["Gurpreet", "Harpreet", "Amandeep", "Jaspreet", "Manpreet", "Arshdeep", "Gagandeep", "Simranjeet", "Karanveer", "Ranjit"], F: ["Simran", "Harleen", "Gurleen", "Navneet", "Jasleen", "Mehak", "Amrit", "Kiran", "Prabhleen", "Sukhmani"] }],
    ["Muslim", { M: ["Aamir", "Faizan", "Imran", "Zaid", "Arman", "Rehan", "Danish", "Tariq", "Farhan", "Salman", "Adnan", "Kabir"], F: ["Aisha", "Zoya", "Fatima", "Sana", "Nida", "Rukhsar", "Hina", "Mariam", "Ayesha", "Zara", "Iqra", "Alina"] }],
    ["Christian", { M: ["Joel", "Jacob", "Alan", "Ryan", "Dennis", "Samuel", "Joseph", "Kevin", "Nathan", "Clinton"], F: ["Maria", "Sarah", "Priscilla", "Angela", "Jennifer", "Rachel", "Tessa", "Nancy", "Anita", "Elizabeth"] }],
])

const ABROAD: [string, string[]][] = [
    ["United States", ["San Jose", "New York", "Seattle"]],
    ["United Kingdom", ["London", "Manchester"]],
    ["Canada", ["Toronto", "Vancouver"]],
    ["United Arab Emirates", ["Dubai", "Abu Dhabi"]],
    ["Singapore", ["Singapore"]],
    ["Australia", ["Sydney", "Melbourne"]],
]

const STAGES: Stage[] = ["ONBOARDING", "VERIFIED", "MATCHES_SUGGESTED", "IN_CONVERSATION", "MEETING_SCHEDULED", "CLOSED"]

let state = 20261019
const rnd = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const chance = (p: number) => rnd() < p
const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1))
const pick = <T>(list: T[]) => list[Math.floor(rnd() * list.length)]
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)))
const normal = (mean: number, sd: number) => mean + sd * Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd())
const wpick = <T>(items: [T, number][]) => {
    const total = items.reduce((sum, [, w]) => sum + w, 0)
    let roll = rnd() * total
    return (items.find(([, w]) => (roll -= w) < 0) ?? items[0])[0]
}

const REF = new Date("2026-10-19T00:00:00Z")
const names = new Set<string>()
const phones = new Set<string>()
let count = 0

interface Own { maker: string; stage: Stage }

const build = (gender: "MALE" | "FEMALE", own?: Own): Prisma.ProfileCreateManyInput => {
    const female = gender === "FEMALE"
    const fam = wpick(FAMILIES.map((f): [Family, number] => [f, f.w]))
    const region = REGIONS[pick(fam.regions)]
    const pool = (NAMES.get(fam.religion) ?? HINDU)[female ? "F" : "M"]
    let firstName = pick(pool)
    let lastName = pick(fam.surnames)
    for (let i = 0; i < 30 && names.has(`${firstName} ${lastName}`); i++) {
        firstName = pick(pool)
        lastName = pick(fam.surnames)
    }
    names.add(`${firstName} ${lastName}`)
    const abroad = chance(0.1)
    const [country, cities] = abroad ? pick(ABROAD) : ["India", region.cities]
    const langs = new Set([region.langs[0]])
    if (region.langs[1] && chance(0.5)) langs.add(region.langs[1])
    if (fam.extra) langs.add(fam.extra)
    if (chance(0.7)) langs.add("Hindi")
    if (chance(0.9)) langs.add("English")
    const role = wpick(ROLES.map((r): [Role, number] => [r, r.w]))
    const [degree, college] = pick(role.edu)
    const age = female ? clamp(normal(28, 3.2), 22, 36) : clamp(normal(30.5, 3.5), 24, 40)
    const exp = Math.max(0, age - 23)
    let phone = `+91 ${pick(["9", "8", "7"])}${int(100000000, 999999999)}`
    while (phones.has(phone)) phone = `+91 ${pick(["9", "8", "7"])}${int(100000000, 999999999)}`
    phones.add(phone)
    count++
    const email = `${firstName}.${lastName}${count}@example.com`.toLowerCase().replace(/[^a-z0-9.@]/g, "")
    return {
        firstName,
        lastName,
        gender,
        dob: new Date(Date.UTC(REF.getUTCFullYear() - age, 9, 19 - int(0, 364))),
        country,
        city: pick(cities),
        heightCm: female ? clamp(normal(161, 5.5), 147, 176) : clamp(normal(174, 6.5), 158, 192),
        email,
        phone,
        college,
        degree,
        incomeLpa: clamp(role.base + exp * role.step * (0.6 + rnd() * 0.8), 3, 150),
        company: pick(role.companies),
        designation: pick(role.titles),
        marital: wpick<Marital>([["NEVER_MARRIED", 85], ["DIVORCED", 12], ["WIDOWED", 3]]),
        languages: [...langs],
        siblings: pick([0, 1, 1, 1, 2, 2, 3]),
        caste: fam.caste,
        religion: fam.religion,
        wantKids: wpick<Choice>([["YES", 55], ["MAYBE", 25], ["NO", 20]]),
        relocate: wpick<Choice>([["YES", 35], ["MAYBE", 40], ["NO", 25]]),
        pets: wpick<Choice>([["YES", 40], ["MAYBE", 30], ["NO", 30]]),
        stage: own?.stage ?? "VERIFIED",
        matchmakerId: own?.maker,
    }
}

export const buildProfiles = (makerIds: string[]) => {
    const mine = (i: number): Own | undefined => (i < 10 ? { maker: makerIds[Math.floor(i / 5)], stage: STAGES[i % STAGES.length] } : undefined)
    const men = Array.from({ length: 100 }, (_, i) => build("MALE", mine(i)))
    const women = Array.from({ length: 100 }, (_, i) => build("FEMALE", mine(i)))
    return [...men, ...women]
}
