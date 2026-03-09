const express = require('express');
const DataLoader = require('dataloader');
const { Queue, Worker } = require('bullmq');
const { prisma, redis } = require('./lib/infrastructure');

const app = express();
app.use(express.json());

// --- A & B. CACHÉ DE CONSULTAS (Redis) [cite: 9, 10, 23] ---
app.get('/products', async (req, res) => {
  const cacheKey = 'products:all';
  console.time('⏱️ Tiempo de Respuesta');

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('✅ [CACHE HIT] Datos servidos desde Redis'); // [cite: 27]
    console.timeEnd('⏱️ Tiempo de Respuesta');
    return res.json({ source: 'Redis Cache', data: JSON.parse(cached) });
  }

  console.log('❌ [CACHE MISS] Consultando PostgreSQL...'); // [cite: 25]
  const products = await prisma.product.findMany();
  
  // Guardamos en Redis con TTL de 60 segundos [cite: 11]
  await redis.setex(cacheKey, 60, JSON.stringify(products));
  
  console.timeEnd('⏱️ Tiempo de Respuesta');
  res.json({ source: 'Database', data: products });
});

// --- C. PREVENCIÓN N+1 (DataLoader) [cite: 14, 15, 33] ---
const categoryLoader = new DataLoader(async (ids) => {
  console.log(`📡 [DATALOADER] Batching query para IDs: [${ids}]`); // [cite: 35]
  const categories = await prisma.category.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => categories.find(c => c.id === id));
});

app.get('/full-catalog', async (req, res) => {
  const products = await prisma.product.findMany();
  
  const results = await Promise.all(products.map(async (p) => ({
    ...p,
    category: await categoryLoader.load(p.categoryId) // [cite: 16]
  })));

  res.json(results);
});

// --- D. COLA DE TRABAJOS (BullMQ) [cite: 17, 18, 38] ---
const taskQueue = new Queue('heavy-tasks', { connection: redis });

app.post('/jobs/report', async (req, res) => {
  const job = await taskQueue.add('generate-report', { date: new Date() }); // [cite: 38]
  res.status(202).json({ jobId: job.id, status: 'Encolado' }); // [cite: 19, 40]
});

const worker = new Worker('heavy-tasks', async (job) => {
  console.log(`⚙️ [WORKER] Procesando tarea pesada #${job.id}...`); // [cite: 41]
  await new Promise(r => setTimeout(r, 5000)); // Simula carga [cite: 41]
  console.log(`✅ [WORKER] Tarea #${job.id} finalizada.`);
}, { connection: redis });

// --- E. LAZY-LOADING & PAGINACIÓN [cite: 43, 44, 48] ---
app.get('/categories', async (req, res) => {
  const { includeProducts, page = 1 } = req.query;
  const limit = 2; // Paginación [cite: 48]

  const data = await prisma.category.findMany({
    take: limit,
    skip: (page - 1) * limit,
    include: { 
        products: includeProducts === 'true' // Inclusión condicional [cite: 45, 47]
    } 
  });

  res.json({ page, count: data.length, data });
});

app.listen(3000, () => console.log('🚀 API Pro activa en http://localhost:3000'));