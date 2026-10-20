export interface Role {
    category: string
    w: number
    base: number
    step: number
    edu: [string, string][]
    titles: string[]
    companies: string[]
}

export const ROLES: Role[] = [
    {
        category: "tech", w: 28, base: 6, step: 3.5,
        edu: [["B.Tech Computer Science", "IIT Roorkee"], ["B.Tech Computer Science", "NIT Trichy"], ["B.Tech Information Technology", "Thapar Institute"], ["B.Tech Computer Science", "BITS Pilani"], ["B.Tech Computer Science", "VIT Vellore"], ["B.Tech Computer Science", "Chitkara University"], ["B.Tech Information Technology", "Delhi Technological University"], ["M.Tech Computer Science", "IIT Delhi"], ["MCA", "Panjab University"], ["B.Tech Computer Science", "Manipal Institute of Technology"], ["B.Tech Computer Science", "PEC Chandigarh"]],
        titles: ["Software Engineer", "Senior Software Engineer", "Data Scientist", "Product Manager", "DevOps Engineer"],
        companies: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Flipkart", "Razorpay", "Zomato", "Adobe", "Freshworks", "Accenture"],
    },
    {
        category: "engineering", w: 8, base: 5, step: 2.5,
        edu: [["B.Tech Mechanical", "NIT Hamirpur"], ["B.Tech Civil", "NIT Kurukshetra"], ["B.Tech Electrical", "IIT Kanpur"], ["B.Tech Mechanical", "COEP Pune"], ["B.Tech Civil", "Anna University"]],
        titles: ["Design Engineer", "Project Engineer", "Site Engineer"],
        companies: ["Larsen & Toubro", "Tata Motors", "Bosch", "Mahindra Group", "Siemens", "BHEL"],
    },
    {
        category: "finance", w: 5, base: 5, step: 2.5,
        edu: [["B.Com Honours", "Shri Ram College of Commerce"], ["B.Com Honours", "Christ University"]],
        titles: ["Financial Analyst"],
        companies: ["Deloitte", "EY", "KPMG", "HDFC Bank", "ICICI Bank", "Axis Bank"],
    },
    {
        category: "finance", w: 5, base: 9, step: 4,
        edu: [["MBA Finance", "IIM Lucknow"], ["MBA Finance", "Narsee Monjee Institute"], ["MBA Finance", "Symbiosis Pune"]],
        titles: ["Investment Banking Associate", "Risk Manager"],
        companies: ["Goldman Sachs", "JP Morgan", "Kotak Mahindra Bank", "HDFC Bank", "American Express"],
    },
    {
        category: "finance", w: 4, base: 7, step: 3.5,
        edu: [["Chartered Accountancy", "ICAI"]],
        titles: ["Chartered Accountant"],
        companies: ["Deloitte", "PwC", "KPMG", "Bajaj Finserv", "Own Practice"],
    },
    {
        category: "medical", w: 8, base: 8, step: 4,
        edu: [["MBBS", "AIIMS Delhi"], ["MBBS", "Maulana Azad Medical College"], ["MD Medicine", "PGIMER Chandigarh"], ["MBBS", "Christian Medical College Vellore"]],
        titles: ["Resident Doctor", "Consultant Physician"],
        companies: ["AIIMS", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "PGIMER"],
    },
    {
        category: "medical", w: 2, base: 5, step: 3,
        edu: [["BDS", "Manipal College of Dental Sciences"]],
        titles: ["Dentist"],
        companies: ["Own Clinic", "Clove Dental"],
    },
    {
        category: "medical", w: 2, base: 4, step: 2,
        edu: [["BPT", "Panjab University"]],
        titles: ["Physiotherapist"],
        companies: ["Apollo Hospitals", "Cult.fit", "Own Clinic"],
    },
    {
        category: "education", w: 6, base: 4, step: 1.2,
        edu: [["MA Economics", "Jawaharlal Nehru University"], ["MA English", "Hindu College"], ["MSc Mathematics", "IIT Bombay"], ["PhD Economics", "Delhi School of Economics"]],
        titles: ["Assistant Professor", "Research Scholar"],
        companies: ["Delhi University", "Panjab University", "Ashoka University", "IISER Pune", "Jawaharlal Nehru University"],
    },
    {
        category: "creative", w: 4, base: 5, step: 2.5,
        edu: [["B.Des", "National Institute of Design"], ["B.Des", "MIT Institute of Design"]],
        titles: ["UX Designer"],
        companies: ["Adobe", "Swiggy", "Zomato", "Razorpay", "Ogilvy"],
    },
    {
        category: "creative", w: 2, base: 4, step: 2,
        edu: [["B.Arch", "CEPT University"]],
        titles: ["Architect"],
        companies: ["Studio Lotus", "Morphogenesis", "Own Studio"],
    },
    {
        category: "creative", w: 3, base: 4, step: 1.8,
        edu: [["BA Journalism", "Symbiosis Pune"], ["BA Mass Communication", "Christ University"]],
        titles: ["Journalist", "Content Strategist"],
        companies: ["Hindustan Times", "NDTV", "Ogilvy", "Times Group"],
    },
    {
        category: "legal", w: 6, base: 5, step: 3,
        edu: [["LLB", "National Law School of India University"], ["BA LLB", "NLU Delhi"], ["LLM", "Symbiosis Law School"], ["BA LLB", "Jindal Global Law School"]],
        titles: ["Associate Advocate", "Legal Counsel"],
        companies: ["Cyril Amarchand Mangaldas", "AZB & Partners", "Khaitan & Co", "Trilegal", "Own Practice"],
    },
    {
        category: "business", w: 12, base: 6, step: 3,
        edu: [["BBA", "Christ University"], ["MBA Marketing", "IIM Ahmedabad"], ["MBA HR", "XLRI Jamshedpur"], ["MBA Operations", "IIM Bangalore"], ["BBA", "Symbiosis Pune"], ["MBA", "ISB Hyderabad"]],
        titles: ["Marketing Manager", "HR Manager", "Operations Manager", "Business Analyst"],
        companies: ["Tata Group", "Reliance", "Hindustan Unilever", "Mahindra Group", "ITC", "Amul", "Family Business"],
    },
    {
        category: "govt", w: 4, base: 8, step: 2,
        edu: [["B.Tech Electronics", "NIT Warangal"], ["MA Political Science", "Delhi University"], ["B.Sc Physics", "Hindu College"], ["B.Tech Electrical", "Punjab Engineering College"]],
        titles: ["Civil Services Officer", "Bank Probationary Officer", "Scientist"],
        companies: ["Government of India", "State Bank of India", "ISRO", "DRDO", "Indian Railways"],
    },
]

const cluster = new Map([["tech", 1], ["engineering", 1], ["govt", 1], ["finance", 2], ["business", 2], ["legal", 2], ["medical", 3], ["education", 4], ["creative", 4]])
const category = new Map(ROLES.flatMap((r) => r.titles.map((t): [string, string] => [t, r.category])))

export const degreeLevel = (degree: string) => (/^(PhD|MD)/.test(degree) ? 3 : /^(LLM|M|Chartered)/.test(degree) ? 2 : 1)

export const roleFit = (a: string, b: string) => {
    const ca = category.get(a) ?? ""
    const cb = category.get(b) ?? ""
    if (ca === cb) return 1
    return cluster.get(ca) === cluster.get(cb) ? 0.7 : 0.4
}
