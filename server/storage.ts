import { users, calculations, type User, type InsertUser, type Calculation, type InsertCalculation } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getUserCalculations(userId: number): Promise<Calculation[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [savedCalculation] = await db
      .insert(calculations)
      .values(calculation)
      .returning();
    return savedCalculation;
  }

  async getUserCalculations(userId: number): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, userId))
      .orderBy(desc(calculations.createdAt));
  }
}

export const storage = new DatabaseStorage();
