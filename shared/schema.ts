import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculationType: text("calculation_type").notNull(), // "module1", "module2", "module3"
  inputData: jsonb("input_data").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  calculations: many(calculations),
}));

export const calculationsRelations = relations(calculations, ({ one }) => ({
  user: one(users, {
    fields: [calculations.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  userId: true,
  calculationType: true,
  inputData: true,
  results: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
