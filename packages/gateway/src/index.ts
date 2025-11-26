import express from "express";
import bodyParser from "body-parser";
import * as grpc from "@grpc/grpc-js";
//import * as protoLoader from "@grpc/proto-loader";
import authRoutes from "./routes/auth.routes";
import { client } from "./grpcClient";
import { swaggerSetup } from "./swagger";

//import path from "path";

// Absolute path to shared proto file
//const PROTO_PATH = path.join(__dirname, "../../proto/library.proto");


//const packageDef = protoLoader.loadSync(PROTO_PATH, {
//keepCase: false,
// longs: String,
// enums: String,
//defaults: true,
//oneofs: true,
//});
//const grpcObj: any = grpc.loadPackageDefinition(packageDef).library;

// Use the correct service name from generated proto
//const client = new grpcObj.LibraryServices(
// process.env.GRPC_SERVER_ADDR || "localhost:50051",
// grpc.credentials.createInsecure()
//);

const app = express();
app.use(bodyParser.json());
//Inject gRPC client globally 
app.locals.grpcClient = client;
//routes
app.use("/auth", authRoutes);






// Create a book
app.post("/books", (req: any, res: any) => {
    const metadata = new grpc.Metadata();
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        metadata.set("authorization", authHeader);
    }

    client.CreateBook(req.body, metadata, (err: any, response: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

// Get a book by ID
app.get("/books/:id", (req: any, res: any) => {
    const metadata = new grpc.Metadata();
    const authHeader = req.headers["authorization"];
    if (authHeader) metadata.set("authorization", authHeader);

    const bookId = Number(req.params.id);
    if (isNaN(bookId)) {
        return res.status(400).json({ error: "Invalid book ID" });
    }

    client.GetBook({ id: bookId }, metadata, (err: any, response: any) => {
        if (err) {
            console.error("gRPC GetBook error:", err);
            const status = err.code === grpc.status.NOT_FOUND ? 404 : 500;
            return res.status(status).json({ error: err.message || "Internal Server Error" });
        }
        res.json(response);
    });
});

// Update a book by ID
app.put("/books/:id", (req: any, res: any) => {
    // Create gRPC metadata
    const metadata = new grpc.Metadata();
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        metadata.set("authorization", authHeader);
    }

    const payload = { id: Number(req.params.id), ...req.body };

    client.UpdateBook(payload, metadata, (err: any, response: any) => {
        if (err) {
            console.error("gRPC UpdateBook error:", err);
            const status = err.code === grpc.status.UNAUTHENTICATED ? 401 : 500;
            return res.status(status).json({ error: err.message || "Internal Server Error" });
        }
        res.json(response);
    });
});


// Delete a book by ID
app.delete("/books/:id", (req: any, res: any) => {
    const metadata = new grpc.Metadata();
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        metadata.set("authorization", authHeader);
    }

    const payload = { id: Number(req.params.id) };

    client.DeleteBook(payload, metadata, (err: any, response: any) => {
        if (err) {
            console.error("gRPC DeleteBook error:", err);
            const status = err.code === grpc.status.UNAUTHENTICATED ? 401 : 500;
            return res.status(status).json({ error: err.message || "Internal Server Error" });
        }
        res.status(204).send();
    });
});


// List books with pagination
app.get("/books", (req: any, res: any) => {
    const metadata = new grpc.Metadata();
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        metadata.set("authorization", authHeader);
    }

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    client.ListBooks({ page, pageSize }, metadata, (err: any, response: any) => {
        if (err) {
            console.error("gRPC ListBooks error:", err);
            const status = err.code === grpc.status.UNAUTHENTICATED ? 401 : 500;
            return res.status(status).json({ error: err.message || "Internal Server Error" });
        }
        res.json(response);
    });
});


swaggerSetup(app);

//Start HTTP gateway

const port = Number(process.env.HTTP_PORT) || 3000;
app.listen(port, () => {
    console.log(`HTTP gateway listening on port ${port}`);
});
