import { PrismaClient, Type } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { DEMO_EMAIL, DEMO_NAME, DEMO_PASSWORD } from "../lib/demo";

// Creates (or resets) the public demo account with ~6 weeks of sample
// transactions. Safe to re-run whenever visitors have made a mess of it.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

type Sample = { title: string; amount: number; category: string; type: Type; daysAgo: number };

const { INCOME, EXPENSE } = Type;

// A bartender picking up freelance web work — fictional numbers
const recurring: Sample[] = [0, 14, 28].flatMap((d) => [
  { title: "Paycheck", amount: 1180, category: "Wages", type: INCOME, daysAgo: d + 2 },
  { title: "Groceries", amount: 96.4, category: "Food", type: EXPENSE, daysAgo: d + 4 },
  { title: "Gas", amount: 42.15, category: "Transport", type: EXPENSE, daysAgo: d + 6 },
]);

const weeklyTips: Sample[] = [0, 7, 14, 21, 28, 35].map((d) => ({
  title: "Weekend tips", amount: 310 + (d % 3) * 35, category: "Tips", type: INCOME, daysAgo: d + 1,
}));

const oneOffs: Sample[] = [
  { title: "Rent", amount: 1250, category: "Housing", type: EXPENSE, daysAgo: 25 },
  { title: "Freelance landing page", amount: 450, category: "Freelance", type: INCOME, daysAgo: 18 },
  { title: "Internet", amount: 65, category: "Utilities", type: EXPENSE, daysAgo: 20 },
  { title: "Phone bill", amount: 48, category: "Utilities", type: EXPENSE, daysAgo: 19 },
  { title: "Electric", amount: 88.3, category: "Utilities", type: EXPENSE, daysAgo: 17 },
  { title: "Domain renewal", amount: 12, category: "Dev tools", type: EXPENSE, daysAgo: 15 },
  { title: "Coffee with a client", amount: 9.75, category: "Food", type: EXPENSE, daysAgo: 13 },
  { title: "Gym membership", amount: 35, category: "Health", type: EXPENSE, daysAgo: 11 },
  { title: "Car insurance", amount: 112, category: "Transport", type: EXPENSE, daysAgo: 9 },
  { title: "Movie night", amount: 28.5, category: "Fun", type: EXPENSE, daysAgo: 5 },
  { title: "Sold old monitor", amount: 60, category: "Other", type: INCOME, daysAgo: 3 },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash },
    create: { name: DEMO_NAME, email: DEMO_EMAIL, passwordHash },
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  const rows = [...recurring, ...weeklyTips, ...oneOffs].map((t) => ({
    title: t.title,
    amount: t.amount,
    category: t.category,
    type: t.type,
    date: daysAgo(t.daysAgo),
    userId: user.id,
  }));
  await prisma.transaction.createMany({ data: rows });
  console.log(`Demo account ready: ${DEMO_EMAIL} with ${rows.length} transactions.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
