const express = require("express");
const DataLoader = require("dataloader");
const { Queue, Worker } = require("bullmq");
const { prisma, redis } = require("./lib/infrastructure");

const app = express();
app.use(express.json());

// -----------------------------------------------------------
// B. CACHÉ DE CONSULTAS 
// -----------------------------------------------------------
app.get("/products", async (req, res) => {
  const cacheKey = "products:all";
  console.time("⏱️ Tiempo de Respuesta");

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("✅ [CACHE HIT] Datos servidos desde Redis");
    console.timeEnd("⏱️ Tiempo de Respuesta");
    return res.json({ source: "Redis Cache", data: JSON.parse(cached) });
  }

  console.log("❌ [CACHE MISS] Consultando PostgreSQL...");
  const products = await prisma.product.findMany();

  // Guardamos en Redis con TTL de 60 segundos
  await redis.setex(cacheKey, 60, JSON.stringify(products));

  console.timeEnd("⏱️ Tiempo de Respuesta");
  res.json({ source: "Database", data: products });
});

// -----------------------------------------------------------
// C. PREVENCIÓN N+1 CON DATALOADER 
// -----------------------------------------------------------
const categoryLoader = new DataLoader(async (ids) => {
  console.log(`📡 [DATALOADER] Batching query para IDs: [${ids}]`);
  const categories = await prisma.category.findMany({
    where: { id: { in: ids } },
  });
  return ids.map((id) => categories.find((c) => c.id === id));
});

app.get("/full-catalog", async (req, res) => {
  const products = await prisma.product.findMany();

  const results = await Promise.all(
    products.map(async (p) => ({
      ...p,
      category: await categoryLoader.load(p.categoryId),
    })),
  );

  res.json(results);
});

// -----------------------------------------------------------
// D. JOB QUEUE CON BULLMQ
// -----------------------------------------------------------
const taskQueue = new Queue("heavy-tasks", { connection: redis });

app.post("/jobs/report", async (req, res) => {
  const job = await taskQueue.add("generate-report", { date: new Date() });
  res.status(202).json({ jobId: job.id, status: "Encolado" });
});

const worker = new Worker(
  "heavy-tasks",
  async (job) => {
    console.log(`⚙️ [WORKER] Procesando tarea pesada #${job.id}...`);
    await new Promise((r) => setTimeout(r, 5000)); // Simula 5 seg de carga
    console.log(`✅ [WORKER] Tarea #${job.id} finalizada.`);
  },
  { connection: redis },
);

app.get("/jobs/status/:id", async (req, res) => {
  const job = await taskQueue.getJob(req.params.id);
  res.json({ id: job.id, state: await job.getState() });
});

// -----------------------------------------------------------
// E. LAZY-LOADING
// -----------------------------------------------------------
app.get("/categories", async (req, res) => {
  const { includeProducts, page = 1 } = req.query;
  const limit = 2; // Paginación para reducir payload

  const data = await prisma.category.findMany({
    take: limit,
    skip: (page - 1) * limit,
    include: { products: includeProducts === "true" }, // Carga condicional
  });

  res.json({ page, count: data.length, data });
});

app.listen(3000, () => console.log("API activa en http://localhost:3000"));
