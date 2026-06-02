"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { updateTag } from "next/cache";

const TITLE_MAX = 100;

  export async function createTransaction(
    title: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category: string,
    date: string,
  ) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();

    if (!trimmedTitle) return { error: "Title is required" };
    if (trimmedTitle.length > TITLE_MAX) return { error: `Title must be under ${TITLE_MAX} characters`
  };
    if (!Number.isFinite(amount) || amount <= 0) return { error: "Amount must be greater than 0" };
    if (!trimmedCategory) return { error: "Category is required" };
    if (type !== "INCOME" && type !== "EXPENSE") return { error: "Invalid type" };

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return { error: "Invalid date" };

    try {
      await prisma.transaction.create({
        data: {
          title: trimmedTitle,
          amount,
          type,
          category: trimmedCategory,
          date: parsedDate,
          userId: session.user.id,
        },
      });
      updateTag(`transactions-${session.user.id}`);
      return { success: true };
    } catch (err) {
      console.error("Failed to create transaction:", err);
      return { error: "Failed to create transaction" };
    }
  }