import { pgTable, serial, varchar, integer, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0"),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const UserPreferences = pgTable("user_preferences", {
  userId: varchar("userId").primaryKey(),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  tier: varchar("tier", { length: 20 }).notNull().default("pro"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const AiChatSessions = pgTable("ai_chat_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  title: varchar("title", { length: 200 }),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
