import { PrismaClient } from "@prisma/client";

const global_prisma = global as unknown as { prisma: PrismaClient };

const prismaClient = global_prisma.prisma || new PrismaClient();

export default prismaClient

