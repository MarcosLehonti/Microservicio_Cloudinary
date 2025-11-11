// controllers/upload.controller.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Document from "../models/Document.js";
// NO necesitamos 'fs' para la subida.
import streamifier from "streamifier"; // 💡 Nuevo import necesario

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadFileController = async (file, patientId) => {
  try {
    const { createReadStream, mimetype, filename } = await file; // Usamos filename para el log/contexto
    
    const fileStream = createReadStream();

    // 💡 Paso CRÍTICO: Usar upload_stream para subir directamente a Cloudinary desde el stream.
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                resource_type: "auto", 
                public_id: `${patientId}_${Date.now()}_${filename}` // Opcional: define un ID público claro
            },
            (error, result) => {
                if (error) {
                    console.error("Error en upload_stream:", error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        // Envía el stream del archivo a la función de subida de Cloudinary
        fileStream.pipe(uploadStream); 
    });
    // Fin del Paso CRÍTICO

    // Si la subida fue exitosa, procedemos a guardar en MongoDB
    const doc = await Document.create({
      patientId,
      fileUrl: result.secure_url,
      fileType: mimetype,
    });

    // Ya NO necesitamos fs.unlinkSync(tempPath) porque nunca se guardó localmente

    return {
      message: "✅ Archivo subido correctamente (Stream)",
      document: doc,
    };
  } catch (error) {
    console.error("Error al subir archivo (Global):", error);
    throw new Error("❌ Error al subir archivo: " + error.message);
  }
};

export const getFilesByPatientIdController = async (patientId) => {
  try {
    const documents = await Document.find({ patientId });
    if (!documents.length) {
      throw new Error("No se encontraron archivos para este paciente");
    }
    return documents;
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    throw new Error("❌ Error al obtener archivos: " + error.message);
  }
};
