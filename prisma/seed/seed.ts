import { PrismaClient } from "@prisma/client";
import { runSetupSeed } from "./runs/working/setup";

const prisma = new PrismaClient();

// const seed = async (): Promise<void> => {
//   try {
//     console.log("Seeding tags...");
//     await runTags(prisma);

//     console.log("Seeding tag children...");
//     await runTagChild(prisma);

//     console.log("Seeding tag children...");
//     await runTagChildContent(prisma);

//     console.log("Seeding files...");
//     await runFile(prisma);

//     console.log("Seeding completed successfully.");
//   } catch (e) {
//     console.error("Error during seeding:", e);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// seed().catch(async (e) => {
//   console.error("Unhandled error during seeding:", e);
//   await prisma.$disconnect();
//   process.exit(1);
// });

const dummyDataSeed = async (): Promise<void> => {
  try {
    console.log("Seeding apps...");
    await runSetupSeed(prisma);

    console.log("Seeding completed successfully.");
  } catch (e) {
    console.error("Error during seeding:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

dummyDataSeed().catch(async (e) => {
  console.error("Unhandled error during seeding:", e);
  await prisma.$disconnect();
  process.exit(1);
});
