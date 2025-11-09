import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { graphqlUploadExpress } from "graphql-upload-minimal";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

export default app;
