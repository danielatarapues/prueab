const { PrismaClient } = require("@prisma/client");
const Redis = require("ioredis");

const prisma = new PrismaClient();

// CONFIGURACIÓN PARA REDIS
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  // Esta línea es la que soluciona el error de BullMQ:
  maxRetriesPerRequest: null,
});

module.exports = { prisma, redis };
