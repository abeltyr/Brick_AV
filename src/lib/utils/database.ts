// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";

// const prisma = new PrismaClient().$extends(withAccelerate());

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
export const getPrisma = () => {
  if (!prisma) setPrisma();

  return prisma;
};

export const setPrisma = () => {
  const prismaData = new PrismaClient();
  prisma = prismaData;
  return prismaData;
};
