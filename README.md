# 🚀 API Caché, N+1, Colas y Lazy Loading

### Node.js • Express • Redis • BullMQ • Prisma

API REST desarrollada en **Node.js con Express** enfocada en demostrar **técnicas de optimización de rendimiento en APIs con alto tráfico**.

El proyecto implementa estrategias comunes en sistemas backend modernos para mejorar:

* ⚡ **Tiempo de respuesta**
* 📉 **Reducción de consultas innecesarias**
* 🔄 **Procesamiento asíncrono**
* 🧠 **Uso eficiente de memoria y recursos**

---

# 🧠 Objetivo del Proyecto

Simular un entorno donde múltiples clientes realizan consultas repetitivas a una API y aplicar estrategias para optimizar su rendimiento mediante:

* **Caché de consultas con Redis**
* **Prevención de consultas N+1 con DataLoader**
* **Procesamiento asíncrono con Job Queue (BullMQ)**
* **Lazy-loading de relaciones y paginación**


---

# 🚀 Instalación y Ejecución

## 1️⃣ Requisitos

Instalar:

* Node.js
* PostgreSQL
* Redis
* Docker

---

## 2️⃣ Levantar Servicios Externos (Redis)
Para que el sistema de caché y colas funcione, inicia el contenedor de Redis:

```
docker run --name redis-taller -p 6379:6379 -d redis
```

---

## 3️⃣ Instalar dependencias

```
npm install
```

---

## 4️⃣ Configurar variables de entorno

Crear archivo `.env`

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/database?schema=public"
```

---

## 5️⃣ Preparar base de datos

```
npx prisma db push
npx prisma generate
node prisma/seed.js
```

---

## 6️⃣ Ejecutar servidor

```
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

# 📈 Informe Técnico

El informe con las capturas de pantalla de los logs, comparativas de tiempos (sin caché vs con caché) y la evidencia del procesamiento asíncrono se encuentra adjunto en la carpeta /docs (o en la raíz del repositorio).

El proyecto incluye evidencias de:

* Comparación de tiempos **con y sin caché**
* Reducción de consultas **N+1 con DataLoader**
* Ejecución de tareas en **Job Queue**
* Comparación de payload **con y sin Lazy Loading**

Las capturas y análisis se encuentran en el informe técnico.

---

# 👨‍💻 Autor

**Erick Rosero**