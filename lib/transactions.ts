import { cacheTag } from "next/cache";
import { prisma } from "@/lib/db";

export async function getTransactions(userId: string) {
    "use cache";
    cacheTag(`transactions-${userId}`);
    return prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
}