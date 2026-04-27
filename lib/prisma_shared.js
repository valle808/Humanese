import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

/** @type {PrismaClient} */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'], // Keep logs clean for swarm operations
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
