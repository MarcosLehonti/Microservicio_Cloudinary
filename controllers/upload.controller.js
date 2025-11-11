// controllers/upload.controller.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Document from "../models/Document.js";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadFileController = async (file, patientId) => {
  try {
    const { createReadStream, mimetype } = await file;

    const tempPath = `uploads/${Date.now()}-${patientId}`;
    const stream = createReadStream();
    const out = fs.createWriteStream(tempPath);
    stream.pipe(out);

    await new Promise((resolve) => out.on("finish", resolve));

    const result = await cloudinary.uploader.upload(tempPath, {
      resource_type: "auto",
    });

    const doc = await Document.create({
      patientId,
      fileUrl: result.secure_url,
      fileType: mimetype,
    });

    fs.unlinkSync(tempPath);

    return {
      message: "✅ Archivo subido correctamente",
      document: doc,
    };
  } catch (error) {
    console.error("Error al subir archivo:", error);
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
