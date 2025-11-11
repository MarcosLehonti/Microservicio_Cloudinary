// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  patientId: {
    type: Number,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
