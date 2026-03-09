const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la carga de datos...');

  // Limpiar datos existentes para evitar duplicados
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Crear Categorías [cite: 35]
  const cat1 = await prisma.category.create({ data: { name: 'Electrónica' } });
  const cat2 = await prisma.category.create({ data: { name: 'Hogar' } });
  const cat3 = await prisma.category.create({ data: { name: 'Moda' } });

  // 2. Crear Productos vinculados [cite: 35]
  await prisma.product.createMany({
    data: [
      { name: 'Laptop Pro', price: 1200, categoryId: cat1.id },
      { name: 'Mouse Inalámbrico', price: 25, categoryId: cat1.id },
      { name: 'Teclado Mecánico', price: 80, categoryId: cat1.id },
      { name: 'Sofá Cama', price: 450, categoryId: cat2.id },
      { name: 'Lámpara LED', price: 35, categoryId: cat2.id },
      { name: 'Camiseta Algodón', price: 15, categoryId: cat3.id },
    ],
  });

  console.log('✅ Datos cargados exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });