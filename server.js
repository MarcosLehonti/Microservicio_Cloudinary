import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import connectDB from "./config/db.js";
import { graphqlUploadExpress } from "graphql-upload-minimal";

dotenv.config();

const app = express();

// ✅ Middleware global (por si usas otras rutas)
app.use(express.json());
app.use(graphqlUploadExpress());

// ✅ Inicializar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false, // permite uploads y evita problemas con CORS
  introspection: true, // habilita el playground o pruebas con Postman
});

await server.start();

// ✅ Aplicar CORS directamente sobre la ruta /graphql
app.use(
  "/graphql",
  cors({
    origin: [
      "http://localhost:4200", // frontend local
      "https://microservicio-cloudinary.onrender.com", // backend Render
      // 👉 si luego despliegas tu frontend, agrégalo aquí también
      // "https://tu-frontend-en-vercel.app"
    ],
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization }),
  })
);

// ✅ Ruta base para verificar el servidor
app.get("/", (req, res) => {
  res.send("🚀 Servidor GraphQL con MongoDB y Cloudinary funcionando ✅");
});

// 🔹 Conectar a MongoDB
try {
  await connectDB();
  console.log("✅ Conexión a MongoDB establecida correctamente.");
} catch (error) {
  console.error("❌ Error al conectar a MongoDB:", error);
}

// 🔹 Iniciar servidor en el puerto asignado por Render
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Servidor GraphQL ejecutándose en http://localhost:${PORT}/graphql`);
});
