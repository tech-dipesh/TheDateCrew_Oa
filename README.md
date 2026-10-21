# Matchmaker Desk
- Building a Matchmaker site let's see.
Internal tool for The Date Crew matchmakers.
## Tech Stack:
- Express + TypeScript: Smallest Api
- Postgres + Prisma: Persistant i belive minimal
- Vercel serverless: Try to bypass a cold start
- Vite SPA: Minimal Frontend web page. 

## Setup
```bash
    cd api && pnpm install && cp .env.example .env ## Fill your Db url
    pnpm migrate && pnpm seed && pnpm dev
```
## Another Tab:
`cd ../web && pnpm install && cp .env.example .env && pnpm dev` 

Seed wipes the tables first.
- Demo login: priya / match1234 (or arjun).

## Data
200 generated profiles, 100 men and 100 women, deterministic. Name, city, college and company pools are common public Indian lists.
## Design:
It worked on the opposite gender pool with the hard filter first like younger earn less or be shoter. And also whoever suruve we add ont eh similarity numbering with a like 1, 0.4 or even 0. 
The final score is the weighted average.
The ai  integration for the ranking i've used for with a: `grok` to write a human part and a top 10 matches.
With the Age is calclaute from a bunch of dob, request time. Income is in the lakhs per annum.
