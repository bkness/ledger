"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(email: string, name: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    if (!normalizedEmail) return { error: "Email is required" };
    if (!EMAIL_REGEX.test(normalizedEmail)) return { error: "Invalid email format" };
    if (!normalizedName) return { error: "Name is required" };
    if (password.length < 8) return { error: "Password must be at least 8 characters long" };

    try {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email: normalizedEmail }, { name: normalizedName }] },
        });

        if (existing) {
            return {
                error: existing.email === normalizedEmail
                    ? "Email is already in use"
                    : "Name is already in use",
            };
        }

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.create({
            data: { email: normalizedEmail, name: normalizedName, passwordHash },
        });

        return { success: true };
    } catch (err) {
        console.error("Registration error:", err);
        return { error: "An unexpected error occurred. Please try again." };
    }
}