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

## Sample Login Credentials:
- Boy: Username: `arjun` Password: `match1234`
- Girl: Username: `priya` Password: `match1234`

## Data
200 generated profiles, 100 men and 100 women, deterministic. Name, city, college and company pools are common public Indian lists.
## Design:
It worked on the opposite gender pool with the hard filter first like younger earn less or be shoter. And also whoever suruve we add ont eh similarity numbering with a like 1, 0.4 or even 0. 
The final score is the weighted average.
The ai  integration for the ranking i've used for with a: `grok` to write a human part and a top 10 matches.
With the Age is calclaute from a bunch of dob, request time. Income is in the lakhs per annum.

## Custom Matching Logic:

### Ai Integration:
I"m using a Groq for the minimal matches which for the only to explain a matches. The Picking will done by ai. The Engine gave a score to everyone out of 100. Thhe top 10 goes to ai model and write a short note for the matchmaker with why and where they might clash. If it key is fails due to any reason, the page fallbs back to rule based reasons.

### Algorithm Design:
The Every Major Factor such as; (aage, income, height, city, education) willl have the 0 to 1 similarity. And the some answer might be a 1 or some might go to 0. The weighted averge wil become a 0 to 100 based on the differenet scoring, with the 60-65 cutoff, and hte if: 85+ mean a high potential.
For the male candidate client we go with the 4 hard level filters:
  i. She Must be a younger
  ii. She must be a Earn Less
  iii. Shorter
  iv. Same pov on the kids
Delivertly i don't add to the woman.
The weight can be changed based on how they are flexible.
- The 200 mock profiles are generated, with Send a match with the mocking.
### Assumptions:
- The hard filters are only for male clients, as the brief said, and I took "earns less" and "shorter" literally.
- The weights, the 0.6 for maybe and the 60 cutoff are my own picks, I had no real match data to tune them.
- All 200 profiles are generated, and Send Match is a mock with the mock email.

# Thanks.