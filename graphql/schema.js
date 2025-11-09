import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Upload

  type Document {
    id: ID!
    patientId: Int!
    fileUrl: String!
    fileType: String!
    createdAt: String
  }

  type UploadResponse {
    message: String!
    document: Document
  }

  type Query {
    getFilesByPatientId(patientId: Int!): [Document!]!
  }

  type Mutation {
    uploadFile(file: Upload!, patientId: Int!): UploadResponse!
  }
`;
