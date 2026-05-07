import prisma from "./lib/prisma";

async function test() {
  console.log("Prisma keys:", Object.keys(prisma));
  try {
    const count = await (prisma as any).review.count();
    console.log("Review count:", count);
  } catch (e) {
    console.log("Error accessing prisma.review:", e);
  }
}

test();
