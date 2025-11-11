import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import connectDB from "./config/db.js"; // 🔹 Importa conexión MongoDB
import { graphqlUploadExpress } from "graphql-upload-minimal";

dotenv.config();

const app = express();

// ✅ CORS: permitir tu frontend o cualquier origen
app.use(
  cors({
    origin: "*", // Cambia esto a tu dominio en producción
    credentials: true,
  })
);

// ✅ Middleware necesario
app.use(express.json());
app.use(graphqlUploadExpress());

// ✅ Inicializar Apollo Server con csrfPrevention deshabilitado
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false, // <---- AQUÍ es donde realmente se desactiva
  introspection: true, // permite probar desde Postman o Apollo Sandbox
});

await server.start();

// ✅ Middleware de Apollo Server
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization }),
  })
);

app.get("/", (req, res) => {
  res.send("🚀 Servidor GraphQL con MongoDB y Cloudinary funcionando ✅");
});

// 🔹 Conexión a MongoDB
try {
  await connectDB(); // 🔹 Conexión usando Mongoose
  console.log("✅ Conexión a MongoDB establecida correctamente.");
} catch (error) {
  console.error("❌ Error al conectar a MongoDB:", error);
}

// 🔹 Levantar servidor
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Servidor GraphQL ejecutándose en http://localhost:${PORT}/graphql`);
});
