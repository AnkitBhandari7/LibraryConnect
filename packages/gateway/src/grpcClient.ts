

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PROTO_PATH = path.join(__dirname, "../../proto/library.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const grpcObj: any = grpc.loadPackageDefinition(packageDef).library;


export const client = new grpcObj.LibraryServices(
    process.env.GRPC_SERVER_ADDR || "localhost:50051",
    grpc.credentials.createInsecure()
);
