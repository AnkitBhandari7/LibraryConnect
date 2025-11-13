import path from "path";
import { execSync } from "child_process";

// Absolute paths for proto and output directories
const protoDir = path.resolve(__dirname, "proto");
const protoFile = path.join(protoDir, "library.proto");
const outDir = protoDir;

try {
    execSync(
        `npx protoc \
        --plugin=protoc-gen-ts_proto=${path.resolve("node_modules/.bin/protoc-gen-ts_proto")} \
        --ts_proto_out=${outDir} \
        --ts_proto_opt=esModuleInterop=true,outputServices=grpc-js \
        --proto_path=${protoDir} \
        ${protoFile}`,
        { stdio: "inherit" }
    );

    console.log(" TypeScript gRPC files generated successfully!");
} catch (error) {
    console.error(" Failed to generate gRPC files:", error);
}
