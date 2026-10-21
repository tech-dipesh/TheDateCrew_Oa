// src/app.ts
import express from "express";
import cors from "cors";

// src/infra/auth.ts
import jwt from "jsonwebtoken";
import { z as z2 } from "zod";

// src/infra/env.ts
import "dotenv/config";
import { z } from "zod";
var schema = z.object({ DB_URL: z.string("Please enter a DB_URL"), JWTKEY: z.string("Please enter a JWTKEY"), GROQKEY: z.string().optional(), PORT: z.coerce.number().default(3e3) });
var parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("please enter these env keys, they are missing or invalid and the server won't work:", Object.keys(z.flattenError(parsed.error).fieldErrors));
  process.exit(1);
}
var env = parsed.data;

// src/infra/catch.ts
var fail = (status, message) => Object.assign(new Error(message), { status });
var withCatch = (fn) => async (req2, res, next) => {
  try {
    await fn(req2, res);
  } catch (err) {
    next(err);
  }
};
var errorHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status < 500 ? err.message : "something went wrong" });
};

// src/infra/auth.ts
var tokenSchema = z2.object({ id: z2.string() });
var auth = (req2, _res, next) => {
  const token = req2.headers.authorization?.split(" ")[1] ?? "";
  try {
    req2.mid = tokenSchema.parse(jwt.verify(token, env.JWTKEY)).id;
  } catch {
    throw fail(401, "please login first");
  }
  next();
};

// src/auth/routes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";

// src/db.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import "@prisma/client/runtime/client";

// prisma/generated/prisma/enums.ts
var Stage = {
  ONBOARDING: "ONBOARDING",
  VERIFIED: "VERIFIED",
  MATCHES_SUGGESTED: "MATCHES_SUGGESTED",
  IN_CONVERSATION: "IN_CONVERSATION",
  MEETING_SCHEDULED: "MEETING_SCHEDULED",
  CLOSED: "CLOSED"
};

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [
    "postgresqlExtensions"
  ],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider        = "prisma-client"\n  output          = "./generated/prisma"\n  previewFeatures = ["postgresqlExtensions"]\n}\n\ndatasource db {\n  provider   = "postgresql"\n  extensions = [pgcrypto]\n}\n\nenum Gender {\n  MALE\n  FEMALE\n}\n\nenum Marital {\n  NEVER_MARRIED\n  DIVORCED\n  WIDOWED\n}\n\nenum Choice {\n  YES\n  NO\n  MAYBE\n}\n\nenum Stage {\n  ONBOARDING\n  VERIFIED\n  MATCHES_SUGGESTED\n  IN_CONVERSATION\n  MEETING_SCHEDULED\n  CLOSED\n}\n\nmodel Matchmaker {\n  id       String      @id @default(uuid())\n  name     String\n  username String      @unique\n  password String\n  clients  Profile[]\n  notes    Note[]\n  sent     SentMatch[]\n}\n\nmodel Profile {\n  id          String   @id @default(uuid())\n  firstName   String\n  lastName    String\n  gender      Gender\n  dob         DateTime\n  country     String\n  city        String\n  heightCm    Int\n  email       String   @unique\n  phone       String   @unique\n  college     String\n  degree      String\n  incomeLpa   Int\n  company     String\n  designation String\n  marital     Marital\n  languages   String[]\n  siblings    Int\n  caste       String\n  religion    String\n  wantKids    Choice\n  relocate    Choice\n  pets        Choice\n  stage       Stage    @default(ONBOARDING)\n  createdAt   DateTime @default(now())\n\n  matchmakerId String?\n  matchmaker   Matchmaker? @relation(fields: [matchmakerId], references: [id])\n  notes        Note[]\n  sentFrom     SentMatch[] @relation("customer")\n  sentTo       SentMatch[] @relation("match")\n\n  @@index([gender])\n  @@index([matchmakerId])\n}\n\nmodel Note {\n  id           String     @id @default(uuid())\n  text         String\n  createdAt    DateTime   @default(now())\n  profileId    String\n  profile      Profile    @relation(fields: [profileId], references: [id], onDelete: Cascade)\n  matchmakerId String\n  matchmaker   Matchmaker @relation(fields: [matchmakerId], references: [id])\n\n  @@index([profileId])\n}\n\nmodel SentMatch {\n  id           String     @id @default(uuid())\n  createdAt    DateTime   @default(now())\n  customerId   String\n  customer     Profile    @relation("customer", fields: [customerId], references: [id], onDelete: Cascade)\n  matchId      String\n  match        Profile    @relation("match", fields: [matchId], references: [id], onDelete: Cascade)\n  matchmakerId String\n  matchmaker   Matchmaker @relation(fields: [matchmakerId], references: [id])\n\n  @@unique([customerId, matchId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Matchmaker":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"clients","kind":"object","type":"Profile","relationName":"MatchmakerToProfile"},{"name":"notes","kind":"object","type":"Note","relationName":"MatchmakerToNote"},{"name":"sent","kind":"object","type":"SentMatch","relationName":"MatchmakerToSentMatch"}],"dbName":null,"schema":null},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"firstName","kind":"scalar","type":"String"},{"name":"lastName","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"dob","kind":"scalar","type":"DateTime"},{"name":"country","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"heightCm","kind":"scalar","type":"Int"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"college","kind":"scalar","type":"String"},{"name":"degree","kind":"scalar","type":"String"},{"name":"incomeLpa","kind":"scalar","type":"Int"},{"name":"company","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"marital","kind":"enum","type":"Marital"},{"name":"languages","kind":"scalar","type":"String"},{"name":"siblings","kind":"scalar","type":"Int"},{"name":"caste","kind":"scalar","type":"String"},{"name":"religion","kind":"scalar","type":"String"},{"name":"wantKids","kind":"enum","type":"Choice"},{"name":"relocate","kind":"enum","type":"Choice"},{"name":"pets","kind":"enum","type":"Choice"},{"name":"stage","kind":"enum","type":"Stage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"matchmakerId","kind":"scalar","type":"String"},{"name":"matchmaker","kind":"object","type":"Matchmaker","relationName":"MatchmakerToProfile"},{"name":"notes","kind":"object","type":"Note","relationName":"NoteToProfile"},{"name":"sentFrom","kind":"object","type":"SentMatch","relationName":"customer"},{"name":"sentTo","kind":"object","type":"SentMatch","relationName":"match"}],"dbName":null,"schema":null},"Note":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"text","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"profile","kind":"object","type":"Profile","relationName":"NoteToProfile"},{"name":"matchmakerId","kind":"scalar","type":"String"},{"name":"matchmaker","kind":"object","type":"Matchmaker","relationName":"MatchmakerToNote"}],"dbName":null,"schema":null},"SentMatch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Profile","relationName":"customer"},{"name":"matchId","kind":"scalar","type":"String"},{"name":"match","kind":"object","type":"Profile","relationName":"match"},{"name":"matchmakerId","kind":"scalar","type":"String"},{"name":"matchmaker","kind":"object","type":"Matchmaker","relationName":"MatchmakerToSentMatch"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","matchmaker","profile","notes","customer","match","sentFrom","sentTo","_count","clients","sent","Matchmaker.findUnique","Matchmaker.findUniqueOrThrow","Matchmaker.findFirst","Matchmaker.findFirstOrThrow","Matchmaker.findMany","data","Matchmaker.createOne","Matchmaker.createMany","Matchmaker.createManyAndReturn","Matchmaker.updateOne","Matchmaker.updateMany","Matchmaker.updateManyAndReturn","create","update","Matchmaker.upsertOne","Matchmaker.deleteOne","Matchmaker.deleteMany","having","_min","_max","Matchmaker.groupBy","Matchmaker.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","_avg","_sum","Profile.groupBy","Profile.aggregate","Note.findUnique","Note.findUniqueOrThrow","Note.findFirst","Note.findFirstOrThrow","Note.findMany","Note.createOne","Note.createMany","Note.createManyAndReturn","Note.updateOne","Note.updateMany","Note.updateManyAndReturn","Note.upsertOne","Note.deleteOne","Note.deleteMany","Note.groupBy","Note.aggregate","SentMatch.findUnique","SentMatch.findUniqueOrThrow","SentMatch.findFirst","SentMatch.findFirstOrThrow","SentMatch.findMany","SentMatch.createOne","SentMatch.createMany","SentMatch.createManyAndReturn","SentMatch.updateOne","SentMatch.updateMany","SentMatch.updateManyAndReturn","SentMatch.upsertOne","SentMatch.deleteOne","SentMatch.deleteMany","SentMatch.groupBy","SentMatch.aggregate","AND","OR","NOT","id","createdAt","customerId","matchId","matchmakerId","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","text","profileId","firstName","lastName","Gender","gender","dob","country","city","heightCm","email","phone","college","degree","incomeLpa","company","designation","Marital","marital","languages","siblings","caste","religion","Choice","wantKids","relocate","pets","Stage","stage","has","hasEvery","hasSome","name","username","password","customerId_matchId","every","some","none","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "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_AQAhdwEAqQEAIXgBAKkBACF6AADAAXoiewAAwQEAIHwCAL8BACF9AQCpAQAhfgEAqQEAIYABAADCAYABIoEBAADCAYABIoIBAADCAYABIoQBAADDAYQBIgIAAAAFACASAAA7ACAaWAEAqQEAIVlAAKoBACFcAQDEAQAhagEAqQEAIWsBAKkBACFtAAC-AW0ibkAAqgEAIW8BAKkBACFwAQCpAQAhcQIAvwEAIXIBAKkBACFzAQCpAQAhdAEAqQEAIXUBAKkBACF2AgC_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_ACF9AQB1ACF-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_QEAIBoAAPwBACABEgAAnQIAMAIAAAAPACASAAD8AQAgAgAAANEBACASAAD7AQAgBFgBAKkBACFZQACqAQAhWgEAqQEAIVsBAKkBACEGBgAAqwEAIAcAAKwBACBYAQCpAQAhWUAAqgEAIVoBAKkBACFbAQCpAQAhBgYAAK4BACAHAACvAQAgWAEAAAABWUAAAAABWgEAAAABWwEAAAABBQQAALYBACBYAQAAAAFZQAAAAAFoAQAAAAFpAQAAAAECAAAACwAgGQAAhgIAIAMAAAALACAZAACGAgAgGgAAhQIAIAESAACcAgAwAgAAAAsAIBIAAIUCACACAAAA5gEAIBIAAIQCACAEWAEAqQEAIVlAAKoBACFoAQCpAQAhaQEAqQEAIQUEAAC0AQAgWAEAqQEAIVlAAKoBACFoAQCpAQAhaQEAqQEAIQUEAAC2AQAgWAEAAAABWUAAAAABaAEAAAABaQEAAAABHAUAAOwBACAIAADtAQAgCQAA7gEAIFgBAAAAAVlAAAAAAWoBAAAAAWsBAAAAAW0AAABtAm5AAAAAAW8BAAAAAXABAAAAAXECAAAAAXIBAAAAAXMBAAAAAXQBAAAAAXUBAAAAAXYCAAAAAXcBAAAAAXgBAAAAAXoAAAB6AnsAAOoBACB8AgAAAAF9AQAAAAF-AQAAAAGAAQAAAIABAoEBAAAAgAECggEAAACAAQKEAQAAAIQBAgIAAAAFACAZAACSAgAgAwAAAAUAIBkAAJICACAaAACRAgAgARIAAJsCADAhAwAApQEAIAUAAJwBACAIAACdAQAgCQAAnQEAIFUAAJ4BADBWAAADABBXAACeAQAwWAEAAAABWUAAlQEAIVwBAKQBACFqAQCWAQAhawEAlgEAIW0AAJ8BbSJuQACVAQAhbwEAlgEAIXABAJYBACFxAgCgAQAhcgEAAAABcwEAAAABdAEAlgEAIXUBAJYBACF2AgCgAQAhdwEAlgEAIXgBAJYBACF6AAChAXoiewAAgQEAIHwCAKABACF9AQCWAQAhfgEAlgEAIYABAACiAYABIoEBAACiAYABIoIBAACiAYABIoQBAACjAYQBIgIAAAAFACASAACRAgAgAgAAAI8CACASAACQAgAgHVUAAI4CADBWAACPAgAQVwAAjgIAMFgBAJYBACFZQACVAQAhXAEApAEAIWoBAJYBACFrAQCWAQAhbQAAnwFtIm5AAJUBACFvAQCWAQAhcAEAlgEAIXECAKABACFyAQCWAQAhcwEAlgEAIXQBAJYBACF1AQCWAQAhdgIAoAEAIXcBAJYBACF4AQCWAQAhegAAoQF6InsAAIEBACB8AgCgAQAhfQEAlgEAIX4BAJYBACGAAQAAogGAASKBAQAAogGAASKCAQAAogGAASKEAQAAowGEASIdVQAAjgIAMFYAAI8CABBXAACOAgAwWAEAlgEAIVlAAJUBACFcAQCkAQAhagEAlgEAIWsBAJYBACFtAACfAW0ibkAAlQEAIW8BAJYBACFwAQCWAQAhcQIAoAEAIXIBAJYBACFzAQCWAQAhdAEAlgEAIXUBAJYBACF2AgCgAQAhdwEAlgEAIXgBAJYBACF6AAChAXoiewAAgQEAIHwCAKABACF9AQCWAQAhfgEAlgEAIYABAACiAYABIoEBAACiAYABIoIBAACiAYABIoQBAACjAYQBIhlYAQCpAQAhWUAAqgEAIWoBAKkBACFrAQCpAQAhbQAAvgFtIm5AAKoBACFvAQCpAQAhcAEAqQEAIXECAL8BACFyAQCpAQAhcwEAqQEAIXQBAKkBACF1AQCpAQAhdgIAvwEAIXcBAKkBACF4AQCpAQAhegAAwAF6InsAAMEBACB8AgC_AQAhfQEAqQEAIX4BAKkBACGAAQAAwgGAASKBAQAAwgGAASKCAQAAwgGAASKEAQAAwwGEASIcBQAAxgEAIAgAAMcBACAJAADIAQAgWAEAqQEAIVlAAKoBACFqAQCpAQAhawEAqQEAIW0AAL4BbSJuQACqAQAhbwEAqQEAIXABAKkBACFxAgC_AQAhcgEAqQEAIXMBAKkBACF0AQCpAQAhdQEAqQEAIXYCAL8BACF3AQCpAQAheAEAqQEAIXoAAMABeiJ7AADBAQAgfAIAvwEAIX0BAKkBACF-AQCpAQAhgAEAAMIBgAEigQEAAMIBgAEiggEAAMIBgAEihAEAAMMBhAEiHAUAAOwBACAIAADtAQAgCQAA7gEAIFgBAAAAAVlAAAAAAWoBAAAAAWsBAAAAAW0AAABtAm5AAAAAAW8BAAAAAXABAAAAAXECAAAAAXIBAAAAAXMBAAAAAXQBAAAAAXUBAAAAAXYCAAAAAXcBAAAAAXgBAAAAAXoAAAB6AnsAAOoBACB8AgAAAAF9AQAAAAF-AQAAAAGAAQAAAIABAoEBAAAAgAECggEAAACAAQKEAQAAAIQBAgQZAACHAgAwkQEAAIgCADCTAQAAigIAIJcBAACLAgAwBBkAAP4BADCRAQAA_wEAMJMBAACBAgAglwEAAOIBADAEGQAA9QEAMJEBAAD2AQAwkwEAAPgBACCXAQAAzQEAMAAAAAUDAACaAgAgBQAAlwIAIAgAAJgCACAJAACYAgAgXAAAuAEAIAMFAACXAgAgCwAAlgIAIAwAAJgCACAZWAEAAAABWUAAAAABagEAAAABawEAAAABbQAAAG0CbkAAAAABbwEAAAABcAEAAAABcQIAAAABcgEAAAABcwEAAAABdAEAAAABdQEAAAABdgIAAAABdwEAAAABeAEAAAABegAAAHoCewAA6gEAIHwCAAAAAX0BAAAAAX4BAAAAAYABAAAAgAECgQEAAACAAQKCAQAAAIABAoQBAAAAhAECBFgBAAAAAVlAAAAAAWgBAAAAAWkBAAAAAQRYAQAAAAFZQAAAAAFaAQAAAAFbAQAAAAEGBQAAlAIAIAwAAJUCACBYAQAAAAGIAQEAAAABiQEBAAAAAYoBAQAAAAECAAAAAQAgGQAAngIAIARYAQAAAAFZQAAAAAFcAQAAAAFoAQAAAAEEWAEAAAABWUAAAAABWwEAAAABXAEAAAABBFgBAAAAAVlAAAAAAVoBAAAAAVwBAAAAAQMAAAAHACAZAACeAgAgGgAApQIAIAgAAAAHACAFAADzAQAgDAAA9AEAIBIAAKUCACBYAQCpAQAhiAEBAKkBACGJAQEAqQEAIYoBAQCpAQAhBgUAAPMBACAMAAD0AQAgWAEAqQEAIYgBAQCpAQAhiQEBAKkBACGKAQEAqQEAIQYLAACTAgAgDAAAlQIAIFgBAAAAAYgBAQAAAAGJAQEAAAABigEBAAAAAQIAAAABACAZAACmAgAgHQMAAOsBACAIAADtAQAgCQAA7gEAIFgBAAAAAVlAAAAAAVwBAAAAAWoBAAAAAWsBAAAAAW0AAABtAm5AAAAAAW8BAAAAAXABAAAAAXECAAAAAXIBAAAAAXMBAAAAAXQBAAAAAXUBAAAAAXYCAAAAAXcBAAAAAXgBAAAAAXoAAAB6AnsAAOoBACB8AgAAAAF9AQAAAAF-AQAAAAGAAQAAAIABAoEBAAAAgAECggEAAACAAQKEAQAAAIQBAgIAAAAFACAZAACoAgAgAwAAAAcAIBkAAKYCACAaAACsAgAgCAAAAAcAIAsAAPIBACAMAAD0AQAgEgAArAIAIFgBAKkBACGIAQEAqQEAIYkBAQCpAQAhigEBAKkBACEGCwAA8gEAIAwAAPQBACBYAQCpAQAhiAEBAKkBACGJAQEAqQEAIYoBAQCpAQAhAwAAAAMAIBkAAKgCACAaAACvAgAgHwAAAAMAIAMAAMUBACAIAADHAQAgCQAAyAEAIBIAAK8CACBYAQCpAQAhWUAAqgEAIVwBAMQBACFqAQCpAQAhawEAqQEAIW0AAL4BbSJuQACqAQAhbwEAqQEAIXABAKkBACFxAgC_AQAhcgEAqQEAIXMBAKkBACF0AQCpAQAhdQEAqQEAIXYCAL8BACF3AQCpAQAheAEAqQEAIXoAAMABeiJ7AADBAQAgfAIAvwEAIX0BAKkBACF-AQCpAQAhgAEAAMIBgAEigQEAAMIBgAEiggEAAMIBgAEihAEAAMMBhAEiHQMAAMUBACAIAADHAQAgCQAAyAEAIFgBAKkBACFZQACqAQAhXAEAxAEAIWoBAKkBACFrAQCpAQAhbQAAvgFtIm5AAKoBACFvAQCpAQAhcAEAqQEAIXECAL8BACFyAQCpAQAhcwEAqQEAIXQBAKkBACF1AQCpAQAhdgIAvwEAIXcBAKkBACF4AQCpAQAhegAAwAF6InsAAMEBACB8AgC_AQAhfQEAqQEAIX4BAKkBACGAAQAAwgGAASKBAQAAwgGAASKCAQAAwgGAASKEAQAAwwGEASIGBQAAlAIAIAsAAJMCACBYAQAAAAGIAQEAAAABiQEBAAAAAYoBAQAAAAECAAAAAQAgGQAAsAIAIB0DAADrAQAgBQAA7AEAIAgAAO0BACBYAQAAAAFZQAAAAAFcAQAAAAFqAQAAAAFrAQAAAAFtAAAAbQJuQAAAAAFvAQAAAAFwAQAAAAFxAgAAAAFyAQAAAAFzAQAAAAF0AQAAAAF1AQAAAAF2AgAAAAF3AQAAAAF4AQAAAAF6AAAAegJ7AADqAQAgfAIAAAABfQEAAAABfgEAAAABgAEAAACAAQKBAQAAAIABAoIBAAAAgAEChAEAAACEAQICAAAABQAgGQAAsgIAIB0DAADrAQAgBQAA7AEAIAkAAO4BACBYAQAAAAFZQAAAAAFcAQAAAAFqAQAAAAFrAQAAAAFtAAAAbQJuQAAAAAFvAQAAAAFwAQAAAAFxAgAAAAFyAQAAAAFzAQAAAAF0AQAAAAF1AQAAAAF2AgAAAAF3AQAAAAF4AQAAAAF6AAAAegJ7AADqAQAgfAIAAAABfQEAAAABfgEAAAABgAEAAACAAQKBAQAAAIABAoIBAAAAgAEChAEAAACEAQICAAAABQAgGQAAtAIAIAMAAAAHACAZAACwAgAgGgAAuAIAIAgAAAAHACAFAADzAQAgCwAA8gEAIBIAALgCACBYAQCpAQAhiAEBAKkBACGJAQEAqQEAIYoBAQCpAQAhBgUAAPMBACALAADyAQAgWAEAqQEAIYgBAQCpAQAhiQEBAKkBACGKAQEAqQEAIQMAAAADACAZAACyAgAgGgAAuwIAIB8AAAADACADAADFAQAgBQAAxgEAIAgAAMcBACASAAC7AgAgWAEAqQEAIVlAAKoBACFcAQDEAQAhagEAqQEAIWsBAKkBACFtAAC-AW0ibkAAqgEAIW8BAKkBACFwAQCpAQAhcQIAvwEAIXIBAKkBACFzAQCpAQAhdAEAqQEAIXUBAKkBACF2AgC_AQAhdwEAqQEAIXgBAKkBACF6AADAAXoiewAAwQEAIHwCAL8BACF9AQCpAQAhfgEAqQEAIYABAADCAYABIoEBAADCAYABIoIBAADCAYABIoQBAADDAYQBIh0DAADFAQAgBQAAxgEAIAgAAMcBACBYAQCpAQAhWUAAqgEAIVwBAMQBACFqAQCpAQAhawEAqQEAIW0AAL4BbSJuQACqAQAhbwEAqQEAIXABAKkBACFxAgC_AQAhcgEAqQEAIXMBAKkBACF0AQCpAQAhdQEAqQEAIXYCAL8BACF3AQCpAQAheAEAqQEAIXoAAMABeiJ7AADBAQAgfAIAvwEAIX0BAKkBACF-AQCpAQAhgAEAAMIBgAEigQEAAMIBgAEiggEAAMIBgAEihAEAAMMBhAEiAwAAAAMAIBkAALQCACAaAAC-AgAgHwAAAAMAIAMAAMUBACAFAADGAQAgCQAAyAEAIBIAAL4CACBYAQCpAQAhWUAAqgEAIVwBAMQBACFqAQCpAQAhawEAqQEAIW0AAL4BbSJuQACqAQAhbwEAqQEAIXABAKkBACFxAgC_AQAhcgEAqQEAIXMBAKkBACF0AQCpAQAhdQEAqQEAIXYCAL8BACF3AQCpAQAheAEAqQEAIXoAAMABeiJ7AADBAQAgfAIAvwEAIX0BAKkBACF-AQCpAQAhgAEAAMIBgAEigQEAAMIBgAEiggEAAMIBgAEihAEAAMMBhAEiHQMAAMUBACAFAADGAQAgCQAAyAEAIFgBAKkBACFZQACqAQAhXAEAxAEAIWoBAKkBACFrAQCpAQAhbQAAvgFtIm5AAKoBACFvAQCpAQAhcAEAqQEAIXECAL8BACFyAQCpAQAhcwEAqQEAIXQBAKkBACF1AQCpAQAhdgIAvwEAIXcBAKkBACF4AQCpAQAhegAAwAF6InsAAMEBACB8AgC_AQAhfQEAqQEAIX4BAKkBACGAAQAAwgGAASKBAQAAwgGAASKCAQAAwgGAASKEAQAAwwGEASIEBRUDCgAGCwYCDBYEBQMIAQUMAwgQBAkRBAoABQIDAAEEAAIDAwABBgACBwACAwUSAAgTAAkUAAMFGAALFwAMGQAAAAADCgALHwAMIAANAAAAAwoACx8ADCAADQEDOgEBA0ABBQoAEh8AFSAAFjEAEzIAFAAAAAAABQoAEh8AFSAAFjEAEzIAFAIDAAEEAAICAwABBAACAwoAGx8AHCAAHQAAAAMKABsfABwgAB0DAwABBgACBwACAwMAAQYAAgcAAgMKACIfACMgACQAAAADCgAiHwAjIAAkDQIBDhoBDxwBEB0BER4BEyABFCIHFSMIFiUBFycHGCgJGykBHCoBHSsHIS4KIi8OIzACJDECJTICJjMCJzQCKDYCKTgHKjkPKzwCLD4HLT8QLkECL0ICMEMHM0YRNEcXNUgDNkkDN0oDOEsDOUwDOk4DO1AHPFEYPVMDPlUHP1YZQFcDQVgDQlkHQ1waRF0eRV4ERl8ER2AESGEESWIESmQES2YHTGcfTWkETmsHT2wgUG0EUW4EUm8HU3IhVHMl"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/db.ts
var connectionString = process.env.DB_URL;
if (!connectionString) {
  process.exit(0);
}
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/infra/validate.ts
import { z as z3 } from "zod";
var validate = (schema2, key = "body") => (req2, res, next) => {
  const parsed2 = schema2.safeParse(req2[key]);
  if (!parsed2.success) {
    res.status(400).json({ error: z3.flattenError(parsed2.error) });
    return;
  }
  if (key === "body") req2.body = parsed2.data;
  next();
};
var req = (name) => z3.string(`Please enter a ${name}`).trim().min(1, `Please enter a ${name}`);

// src/auth/schema.ts
import { z as z4 } from "zod";
var loginSchema = z4.object({ username: req("username"), password: req("password") });

// src/auth/routes.ts
var authRouter = Router();
authRouter.post("/login", validate(loginSchema), withCatch(async (req2, res) => {
  const { username, password } = req2.body;
  const user = await prisma.matchmaker.findUnique({ where: { username } });
  if (!user || !await bcrypt.compare(password, user.password)) throw fail(401, "wrong username or password");
  const token = jwt2.sign({ id: user.id }, env.JWTKEY, { expiresIn: "7d" });
  res.json({ token, name: user.name });
}));

// src/customers/routes.ts
import { Router as Router2 } from "express";

// src/infra/age.ts
var ageOf = (dob) => Math.floor((Date.now() - dob.getTime()) / 315576e5);

// src/customers/service.ts
var findOwn = async (id, mid) => {
  const customer = await prisma.profile.findFirst({ where: { id, matchmakerId: mid } });
  if (!customer) throw fail(404, "customer not found");
  return customer;
};

// src/customers/schema.ts
import { z as z5 } from "zod";
var idSchema = z5.object({ id: z5.uuid("Invalid customer id") });
var stageSchema = z5.object({ stage: z5.enum(Stage, "Please pick a valid stage") });
var noteSchema = z5.object({ text: req("note") });

// src/customers/routes.ts
var customerRouter = Router2();
customerRouter.get("/", withCatch(async (req2, res) => {
  const customers = await prisma.profile.findMany({
    where: { matchmakerId: req2.mid },
    select: { id: true, firstName: true, lastName: true, dob: true, city: true, marital: true, stage: true },
    orderBy: { firstName: "asc" }
  });
  res.json(customers.map((c) => ({ ...c, age: ageOf(c.dob) })));
}));
customerRouter.get("/:id", validate(idSchema, "params"), withCatch(async (req2, res) => {
  const customer = await findOwn(req2.params.id, req2.mid);
  res.json({ ...customer, age: ageOf(customer.dob) });
}));
customerRouter.patch("/:id/stage", validate(idSchema, "params"), validate(stageSchema), withCatch(async (req2, res) => {
  const { id } = req2.params;
  await findOwn(id, req2.mid);
  const { stage } = await prisma.profile.update({ where: { id }, data: { stage: req2.body.stage } });
  res.json({ id, stage });
}));
customerRouter.get("/:id/notes", validate(idSchema, "params"), withCatch(async (req2, res) => {
  const { id } = req2.params;
  await findOwn(id, req2.mid);
  res.json(await prisma.note.findMany({ where: { profileId: id }, orderBy: { createdAt: "desc" } }));
}));
customerRouter.post("/:id/notes", validate(idSchema, "params"), validate(noteSchema), withCatch(async (req2, res) => {
  const { id } = req2.params;
  await findOwn(id, req2.mid);
  const note = await prisma.note.create({ data: { profileId: id, matchmakerId: req2.mid, text: req2.body.text } });
  res.status(201).json(note);
}));

// src/matches/routes.ts
import { Router as Router3 } from "express";

// src/matches/ai.ts
import { z as z6 } from "zod";
var reply = z6.object({ choices: z6.array(z6.object({ message: z6.object({ content: z6.string() }) })).min(1) });
var notes = z6.record(z6.string(), z6.string());
var system = "You help a matchmaker at an Indian matrimonial service. You get a client and ranked candidates with a computed compatibility score, strengths and concerns. For each candidate write 1 or 2 warm, specific sentences on why they could suit the client, and name one honest concern if there is one. Use only the facts given, never invent details, never change the score. Reply with JSON only: an object mapping each candidate id to its text.";
var brief = (p) => ({
  name: p.firstName,
  age: ageOf(p.dob),
  city: p.city,
  country: p.country,
  heightCm: p.heightCm,
  education: `${p.degree}, ${p.college}`,
  job: `${p.designation} at ${p.company}`,
  incomeLpa: p.incomeLpa,
  religion: p.religion,
  wantsKids: p.wantKids,
  openToRelocate: p.relocate,
  openToPets: p.pets,
  languages: p.languages
});
var explain = async (customer, top) => {
  const key = env.GROQKEY;
  if (!key) return /* @__PURE__ */ new Map();
  const candidates = top.map((s) => ({ id: s.profile.id, ...brief(s.profile), score: s.score, strengths: s.reasons, concerns: s.concerns }));
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        temperature: 0.4,
        reasoning_effort: "low",
        max_completion_tokens: 2500,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: JSON.stringify({ client: brief(customer), candidates }) }]
      }),
      signal: AbortSignal.timeout(2e4)
    });
    if (!res.ok) return /* @__PURE__ */ new Map();
    const { choices } = reply.parse(await res.json());
    return new Map(Object.entries(notes.parse(JSON.parse(choices[0].message.content))));
  } catch {
    return /* @__PURE__ */ new Map();
  }
};

// src/matches/schema.ts
import { z as z7 } from "zod";
var querySchema = z7.object({ community: z7.enum(["true", "false"], "community must be true or false").optional() });
var sendSchema = z7.object({ id: z7.uuid("Invalid customer id"), matchId: z7.uuid("Invalid match id") });

// src/matches/roles.ts
var ROLES = [
  {
    category: "tech",
    w: 28,
    base: 6,
    step: 3.5,
    edu: [["B.Tech Computer Science", "IIT Roorkee"], ["B.Tech Computer Science", "NIT Trichy"], ["B.Tech Information Technology", "Thapar Institute"], ["B.Tech Computer Science", "BITS Pilani"], ["B.Tech Computer Science", "VIT Vellore"], ["B.Tech Computer Science", "Chitkara University"], ["B.Tech Information Technology", "Delhi Technological University"], ["M.Tech Computer Science", "IIT Delhi"], ["MCA", "Panjab University"], ["B.Tech Computer Science", "Manipal Institute of Technology"], ["B.Tech Computer Science", "PEC Chandigarh"]],
    titles: ["Software Engineer", "Senior Software Engineer", "Data Scientist", "Product Manager", "DevOps Engineer"],
    companies: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Flipkart", "Razorpay", "Zomato", "Adobe", "Freshworks", "Accenture"]
  },
  {
    category: "engineering",
    w: 8,
    base: 5,
    step: 2.5,
    edu: [["B.Tech Mechanical", "NIT Hamirpur"], ["B.Tech Civil", "NIT Kurukshetra"], ["B.Tech Electrical", "IIT Kanpur"], ["B.Tech Mechanical", "COEP Pune"], ["B.Tech Civil", "Anna University"]],
    titles: ["Design Engineer", "Project Engineer", "Site Engineer"],
    companies: ["Larsen & Toubro", "Tata Motors", "Bosch", "Mahindra Group", "Siemens", "BHEL"]
  },
  {
    category: "finance",
    w: 5,
    base: 5,
    step: 2.5,
    edu: [["B.Com Honours", "Shri Ram College of Commerce"], ["B.Com Honours", "Christ University"]],
    titles: ["Financial Analyst"],
    companies: ["Deloitte", "EY", "KPMG", "HDFC Bank", "ICICI Bank", "Axis Bank"]
  },
  {
    category: "finance",
    w: 5,
    base: 9,
    step: 4,
    edu: [["MBA Finance", "IIM Lucknow"], ["MBA Finance", "Narsee Monjee Institute"], ["MBA Finance", "Symbiosis Pune"]],
    titles: ["Investment Banking Associate", "Risk Manager"],
    companies: ["Goldman Sachs", "JP Morgan", "Kotak Mahindra Bank", "HDFC Bank", "American Express"]
  },
  {
    category: "finance",
    w: 4,
    base: 7,
    step: 3.5,
    edu: [["Chartered Accountancy", "ICAI"]],
    titles: ["Chartered Accountant"],
    companies: ["Deloitte", "PwC", "KPMG", "Bajaj Finserv", "Own Practice"]
  },
  {
    category: "medical",
    w: 8,
    base: 8,
    step: 4,
    edu: [["MBBS", "AIIMS Delhi"], ["MBBS", "Maulana Azad Medical College"], ["MD Medicine", "PGIMER Chandigarh"], ["MBBS", "Christian Medical College Vellore"]],
    titles: ["Resident Doctor", "Consultant Physician"],
    companies: ["AIIMS", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "PGIMER"]
  },
  {
    category: "medical",
    w: 2,
    base: 5,
    step: 3,
    edu: [["BDS", "Manipal College of Dental Sciences"]],
    titles: ["Dentist"],
    companies: ["Own Clinic", "Clove Dental"]
  },
  {
    category: "medical",
    w: 2,
    base: 4,
    step: 2,
    edu: [["BPT", "Panjab University"]],
    titles: ["Physiotherapist"],
    companies: ["Apollo Hospitals", "Cult.fit", "Own Clinic"]
  },
  {
    category: "education",
    w: 6,
    base: 4,
    step: 1.2,
    edu: [["MA Economics", "Jawaharlal Nehru University"], ["MA English", "Hindu College"], ["MSc Mathematics", "IIT Bombay"], ["PhD Economics", "Delhi School of Economics"]],
    titles: ["Assistant Professor", "Research Scholar"],
    companies: ["Delhi University", "Panjab University", "Ashoka University", "IISER Pune", "Jawaharlal Nehru University"]
  },
  {
    category: "creative",
    w: 4,
    base: 5,
    step: 2.5,
    edu: [["B.Des", "National Institute of Design"], ["B.Des", "MIT Institute of Design"]],
    titles: ["UX Designer"],
    companies: ["Adobe", "Swiggy", "Zomato", "Razorpay", "Ogilvy"]
  },
  {
    category: "creative",
    w: 2,
    base: 4,
    step: 2,
    edu: [["B.Arch", "CEPT University"]],
    titles: ["Architect"],
    companies: ["Studio Lotus", "Morphogenesis", "Own Studio"]
  },
  {
    category: "creative",
    w: 3,
    base: 4,
    step: 1.8,
    edu: [["BA Journalism", "Symbiosis Pune"], ["BA Mass Communication", "Christ University"]],
    titles: ["Journalist", "Content Strategist"],
    companies: ["Hindustan Times", "NDTV", "Ogilvy", "Times Group"]
  },
  {
    category: "legal",
    w: 6,
    base: 5,
    step: 3,
    edu: [["LLB", "National Law School of India University"], ["BA LLB", "NLU Delhi"], ["LLM", "Symbiosis Law School"], ["BA LLB", "Jindal Global Law School"]],
    titles: ["Associate Advocate", "Legal Counsel"],
    companies: ["Cyril Amarchand Mangaldas", "AZB & Partners", "Khaitan & Co", "Trilegal", "Own Practice"]
  },
  {
    category: "business",
    w: 12,
    base: 6,
    step: 3,
    edu: [["BBA", "Christ University"], ["MBA Marketing", "IIM Ahmedabad"], ["MBA HR", "XLRI Jamshedpur"], ["MBA Operations", "IIM Bangalore"], ["BBA", "Symbiosis Pune"], ["MBA", "ISB Hyderabad"]],
    titles: ["Marketing Manager", "HR Manager", "Operations Manager", "Business Analyst"],
    companies: ["Tata Group", "Reliance", "Hindustan Unilever", "Mahindra Group", "ITC", "Amul", "Family Business"]
  },
  {
    category: "govt",
    w: 4,
    base: 8,
    step: 2,
    edu: [["B.Tech Electronics", "NIT Warangal"], ["MA Political Science", "Delhi University"], ["B.Sc Physics", "Hindu College"], ["B.Tech Electrical", "Punjab Engineering College"]],
    titles: ["Civil Services Officer", "Bank Probationary Officer", "Scientist"],
    companies: ["Government of India", "State Bank of India", "ISRO", "DRDO", "Indian Railways"]
  }
];
var cluster = /* @__PURE__ */ new Map([["tech", 1], ["engineering", 1], ["govt", 1], ["finance", 2], ["business", 2], ["legal", 2], ["medical", 3], ["education", 4], ["creative", 4]]);
var category = new Map(ROLES.flatMap((r) => r.titles.map((t) => [t, r.category])));
var degreeLevel = (degree) => /^(PhD|MD)/.test(degree) ? 3 : /^(LLM|M|Chartered)/.test(degree) ? 2 : 1;
var roleFit = (a, b) => {
  const ca = category.get(a) ?? "";
  const cb = category.get(b) ?? "";
  if (ca === cb) return 1;
  return cluster.get(ca) === cluster.get(cb) ? 0.7 : 0.4;
};

// src/matches/rules.ts
var open = { YES: 1, MAYBE: 0.5, NO: 0 };
var choiceFit = (a, b) => a === b ? 1 : a === "MAYBE" || b === "MAYBE" ? 0.6 : 0;
var bandFit = (gap, lo, hi) => {
  const miss = gap < lo ? lo - gap : gap > hi ? gap - hi : 0;
  return Math.max(0.1, 1 - 0.15 * miss);
};
var placeFit = (a, b) => {
  if (a.city === b.city) return 1;
  const willing = Math.max(open[a.relocate], open[b.relocate]);
  return (a.country === b.country ? 0.3 : 0) + 0.7 * willing;
};
var langFit = (a, b) => a.languages.some((l) => l !== "English" && b.languages.includes(l)) ? 1 : 0.4;
var eduFit = (a, b) => Math.max(0, 1 - 0.4 * Math.abs(degreeLevel(a.degree) - degreeLevel(b.degree)));
var communityFit = (a, b) => (a.religion === b.religion ? 0.5 : 0) + (a.caste === b.caste ? 0.5 : 0);
var incomeFit = (own, other) => Math.min(1, other / own);
var maleFilters = (c, p, ageC, ageP) => {
  const out = [];
  if (ageP >= ageC) out.push({ key: "age", text: `Age ${ageP} is not younger than ${ageC}` });
  if (p.incomeLpa >= c.incomeLpa) out.push({ key: "income", text: `Income ${p.incomeLpa} LPA is not below ${c.incomeLpa} LPA` });
  if (p.heightCm >= c.heightCm) out.push({ key: "height", text: `Height ${p.heightCm} cm is not below ${c.heightCm} cm` });
  if (choiceFit(c.wantKids, p.wantKids) === 0) out.push({ key: "kids", text: "Opposite views on children" });
  return out;
};

// src/matches/engine.ts
var MIN = 60;
var good = {
  kids: "Same view on children",
  age: "Comfortable age gap",
  place: "Easy to meet, same city or open to relocate",
  work: "Compatible professions",
  edu: "Similar education",
  pets: "Aligned on pets",
  lang: "Shares a language",
  marital: "Same marital history",
  income: "Comparable income",
  community: "Same community"
};
var weak = {
  kids: "Different views on children",
  age: "Age gap is outside the sweet spot",
  place: "Distance or relocation could be hard",
  work: "Professions are far apart",
  edu: "Education levels differ",
  pets: "Different views on pets",
  lang: "No shared regional language",
  marital: "Different marital history",
  income: "Income gap",
  community: "Different community"
};
var labelOf = (score) => score >= 82 ? "High potential match" : score >= 70 ? "Good fit" : "Worth a look";
var parts = (c, p, community) => {
  const male = c.gender === "MALE";
  const gap = male ? ageOf(c.dob) - ageOf(p.dob) : ageOf(p.dob) - ageOf(c.dob);
  const list = [
    { key: "kids", w: male ? 0.25 : 0.2, score: choiceFit(c.wantKids, p.wantKids) },
    { key: "age", w: male ? 0.2 : 0.15, score: bandFit(gap, 1, male ? 5 : 6) },
    { key: "place", w: 0.15, score: placeFit(c, p) },
    { key: "work", w: male ? 0.1 : 0.15, score: roleFit(c.designation, p.designation) },
    { key: "edu", w: 0.1, score: eduFit(c, p) },
    { key: "pets", w: 0.05, score: choiceFit(c.pets, p.pets) },
    { key: "lang", w: 0.05, score: langFit(c, p) },
    { key: "marital", w: 0.05, score: c.marital === p.marital ? 1 : 0.4 }
  ];
  if (!male) list.push({ key: "income", w: 0.1, score: incomeFit(c.incomeLpa, p.incomeLpa) });
  if (community) list.push({ key: "community", w: 0.15, score: communityFit(c, p) });
  return list;
};
var scoreOne = (c, p, community) => {
  const list = parts(c, p, community);
  const total = list.reduce((sum, x) => sum + x.w * x.score, 0);
  const weight = list.reduce((sum, x) => sum + x.w, 0);
  const score = Math.round(100 * total / weight);
  const strong = list.filter((x) => x.score >= 0.8);
  const best = strong.toSorted((a, b) => b.w - a.w).slice(0, 4);
  const reasons = best.map((x) => x.key === "place" && c.city === p.city ? `Both in ${p.city}` : good[x.key]);
  const lows = list.filter((x) => x.score < 0.6);
  const low = lows.toSorted((a, b) => a.score - b.score).slice(0, 3);
  const concerns = low.map((x) => weak[x.key]);
  const hard = c.gender === "MALE" ? maleFilters(c, p, ageOf(c.dob), ageOf(p.dob)) : [];
  const soft = low.map((x) => ({ key: x.key, text: weak[x.key] }));
  const cut = score < MIN ? [{ key: "score", text: `Overall score ${score} is below the ${MIN} cutoff` }, ...soft] : [];
  return { profile: p, age: ageOf(p.dob), score, label: labelOf(score), reasons, concerns, why: hard.length ? hard : cut };
};
var rank = (customer, pool, community) => {
  const scored = pool.map((p) => scoreOne(customer, p, community));
  const fits = scored.filter((s) => s.why.length === 0);
  const misses = scored.filter((s) => s.why.length > 0);
  const matches = fits.toSorted((a, b) => b.score - a.score);
  const rejected = misses.toSorted((a, b) => a.why.length - b.why.length || b.score - a.score);
  return { matches, rejected };
};

// src/matches/service.ts
var run = async (id, mid, community) => {
  const customer = await findOwn(id, mid);
  const pool = await prisma.profile.findMany({ where: { gender: customer.gender === "MALE" ? "FEMALE" : "MALE" } });
  return { customer, ...rank(customer, pool, community) };
};
var card = (s, sent = false) => {
  const { email, phone, matchmakerId, createdAt, stage, dob, ...pub } = s.profile;
  return { ...pub, age: s.age, score: s.score, label: s.label, reasons: s.reasons, concerns: s.concerns, sent };
};
var mockEmail = (customer, match, maker) => {
  const intro = [`Hi ${customer.firstName},`, `${maker} from The Date Crew here. Based on what you shared with us, I think you two should meet.`];
  const profile = [
    `${match.firstName} ${match.lastName}, ${ageOf(match.dob)}, ${match.city}`,
    `Height: ${match.heightCm} cm`,
    `Education: ${match.degree}, ${match.college}`,
    `Work: ${match.designation} at ${match.company}`,
    `Languages: ${match.languages.join(", ")}`
  ];
  const close = ["Reply to this email and I will set up an introduction.", `Warmly,
${maker}`];
  return { to: customer.email, subject: `A match for you: ${match.firstName} from ${match.city}`, body: [...intro, profile.join("\n"), ...close].join("\n\n") };
};

// src/matches/routes.ts
var matchRouter = Router3({ mergeParams: true });
matchRouter.get("/", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req2, res) => {
  const { id } = req2.params;
  const { matches, rejected } = await run(id, req2.mid, req2.query.community === "true");
  const sent = await prisma.sentMatch.findMany({ where: { customerId: id }, select: { matchId: true } });
  const done = new Set(sent.map((s) => s.matchId));
  const top = matches.slice(0, 10);
  res.json({ eligible: matches.length, rejected: rejected.length, matches: top.map((s) => card(s, done.has(s.profile.id))) });
}));
matchRouter.get("/explain", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req2, res) => {
  const { customer, matches } = await run(req2.params.id, req2.mid, req2.query.community === "true");
  const top = matches.slice(0, 10);
  const notes2 = await explain(customer, top);
  const texts = top.map((s) => [s.profile.id, notes2.get(s.profile.id) ?? s.reasons.join(". ")]);
  res.json({ source: notes2.size ? "groq" : "rules", notes: Object.fromEntries(texts) });
}));
matchRouter.get("/rejected", validate(idSchema, "params"), validate(querySchema, "query"), withCatch(async (req2, res) => {
  const { rejected } = await run(req2.params.id, req2.mid, req2.query.community === "true");
  const keys = rejected.flatMap((s) => s.why.map((w) => w.key));
  const summary = keys.reduce((all, key) => ({ ...all, [key]: (all[key] ?? 0) + 1 }), {});
  const near = rejected.slice(0, 30);
  res.json({ total: rejected.length, summary, rejected: near.map((s) => ({ ...card(s), why: s.why })) });
}));
matchRouter.post("/:matchId/send", validate(sendSchema, "params"), withCatch(async (req2, res) => {
  const { id, matchId } = req2.params;
  const customer = await findOwn(id, req2.mid);
  const match = await prisma.profile.findUnique({ where: { id: matchId } });
  if (!match || match.gender === customer.gender) throw fail(404, "match not found");
  const done = await prisma.sentMatch.findUnique({ where: { customerId_matchId: { customerId: id, matchId } } });
  if (done) throw fail(409, "this match was already sent");
  const maker = await prisma.matchmaker.findUniqueOrThrow({ where: { id: req2.mid } });
  await prisma.sentMatch.create({ data: { customerId: id, matchId, matchmakerId: req2.mid } });
  res.status(201).json(mockEmail(customer, match, maker.name));
}));

// src/app.ts
var app = express();
app.use(cors(), express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/customers/:id/matches", auth, matchRouter);
app.use("/customers", auth, customerRouter);
app.use((_req, res) => res.status(404).json({ error: "route not found" }));
app.use(errorHandler);

// src/index.ts
if (!process.env.VERCEL) app.listen(env.PORT, () => {
  console.log("api on", env.PORT);
});
var index_default = app;
export {
  index_default as default
};
