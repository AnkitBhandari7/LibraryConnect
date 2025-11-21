import express from "express";
import bodyParser from "body-parser";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import path from "path";

// Absolute path to shared proto file
const PROTO_PATH = path.resolve(__dirname, "../../proto/library.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const grpcObj: any = grpc.loadPackageDefinition(packageDef).library;

// Use the correct service name from generated proto
const client = new grpcObj.LibraryServices(
    process.env.GRPC_SERVER_ADDR || "localhost:50051",
    grpc.credentials.createInsecure()
);

const app = express();
app.use(bodyParser.json());

// Create a book
app.post("/books", (req: any, res: any) => {
    client.CreateBook(req.body, (err: any, response: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Get a book by ID
app.get("/books/:id", (req: any, res: any) => {
    client.GetBook({ id: Number(req.params.id) }, (err: any, response: any) => {
        if (err) {
            const status = err.code === grpc.status.NOT_FOUND ? 404 : 500;
            return res.status(status).json({ error: err.message });
        }
        res.json(response);
    });
});

// Update a book by ID
app.put("/books/:id", (req: any, res: any) => {
    const payload = { id: Number(req.params.id), ...req.body };
    client.UpdateBook(payload, (err: any, response: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

// Delete a book by ID
app.delete("/books/:id", (req: any, res: any) => {
    client.DeleteBook({ id: Number(req.params.id) }, (err: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

// List books with pagination
app.get("/books", (req: any, res: any) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    client.ListBooks({ page, pageSize }, (err: any, response: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Start HTTP gateway
const port = Number(process.env.HTTP_PORT) || 3000;
app.listen(port, () => {
    console.log(`HTTP gateway listening on port ${port}`);
});
