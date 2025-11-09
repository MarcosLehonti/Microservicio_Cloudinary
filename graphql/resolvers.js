// Antes: import { GraphQLUpload } from "graphql-upload";
// 👇 CORREGIDO: Usamos el paquete que SÍ tienes instalado y es compatible (graphql-upload-minimal)
import { GraphQLUpload } from "graphql-upload-minimal"; 
import { uploadFileController, getFilesByPatientIdController } from "../controllers/upload.controller.js";

export const resolvers = {
  // El nombre del tipo sigue siendo 'Upload'
  Upload: GraphQLUpload,

  Query: {
    getFilesByPatientId: async (_, { patientId }) => {
      return await getFilesByPatientIdController(patientId);
    },
  },

  Mutation: {
    uploadFile: async (_, { file, patientId }) => {
      return await uploadFileController(file, patientId);
    },
  },
};