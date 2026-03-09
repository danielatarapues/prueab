¡Claro que sí, Daniela! Aquí tienes el archivo `README.md` listo para que lo copies, lo pegues en la raíz de tu proyecto y lo subas a GitHub. Está diseñado para que se vea súper profesional, digno de una **Tecnóloga en Software**.

---

```markdown
# 🚀 API Performance Workshop - Node.js & Redis

Este proyecto consiste en una API REST construida con **Node.js** y **Express**, optimizada para entornos de alto tráfico. El objetivo principal es demostrar la implementación de estrategias de rendimiento para mejorar tiempos de respuesta, estabilidad bajo concurrencia y eficiencia en el uso de recursos.

## 🛠️ Tecnologías Utilizadas

* **Runtime:** Node.js (v22+)
* **Framework:** Express.js
* **ORM:** Prisma (PostgreSQL)
* **Caché & Queues:** Redis
* **Gestión de Colas:** BullMQ
* **Optimización de Consultas:** DataLoader

---

## 📋 Características y Estrategias Implementadas

### A. Caché de Consultas Repetitivas
Implementación de una estrategia **Cache-Aside** utilizando Redis. Las consultas al catálogo de productos se sirven desde la memoria después de la primera petición, reduciendo la latencia de ~20ms a <3ms.
* **TTL:** 60 segundos.
* **Endpoint:** `GET /products`



### B. Prevención de Consultas N+1
Uso de **DataLoader** para agrupar (batching) solicitudes de categorías. En lugar de ejecutar múltiples consultas individuales, el sistema recolecta los IDs y ejecuta una única consulta SQL `IN (...)`.
* **Endpoint:** `GET /full-catalog`



### C. Cola de Trabajos (Job Queue)
Delegación de procesos pesados (como generación de reportes) fuera del flujo principal de la solicitud utilizando **BullMQ**. Esto permite una respuesta inmediata al cliente (`202 Accepted`) mientras un Worker procesa la tarea en segundo plano.
* **Endpoints:** `POST /jobs/report` y `GET /jobs/status/:id`

### D. Lazy-loading de Recursos
Optimización del payload mediante carga condicional de relaciones y paginación, evitando el envío de datos innecesarios a través de la red.
* **Endpoint:** `GET /categories?includeProducts=true`

---

## 🚀 Pasos de Ejecución

### 1. Requisitos Previos
* Tener instalado **Node.js**, **PostgreSQL** y **Redis**.
* Configurar una base de datos en **pgAdmin**.

### 2. Instalación
```bash
# Instalar dependencias
npm install

```

### 3. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura tu URL de conexión:

```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/NOMBRE_DB?schema=public"

```

### 4. Preparación de la Base de Datos

```bash
# Sincronizar esquemas con PostgreSQL
npx prisma db push

# Generar el cliente de Prisma
npx prisma generate

```

### 5. Ejecución

```bash
# Iniciar el servidor en modo desarrollo
npm run dev

```

---

## 📖 Informe Técnico

El informe con las capturas de pantalla de los logs, comparativas de tiempos (sin caché vs con caché) y la evidencia del procesamiento asíncrono se encuentra adjunto en la carpeta `/docs` (o en la raíz del repositorio).

---

Desarrollado por **Erick Rosero**.

```

---