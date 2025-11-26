import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { connectDB, sequelize } from "./config/db";
import { Book } from "./models/Book";
import { LibraryServiceDefinition } from "./server";
import authController from "./controllers/auth.controller";
import BookController from "./controllers/book.controller";
import {AuthMiddleware} from "./middlewares/auth.middleware";



// Correct path to proto and include google-proto-files for Empty type
const PROTO_PATH = path.join(__dirname, "../../proto/library.proto");


const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
        path.join(__dirname, "proto"),
        path.join(process.cwd(), "node_modules/google-proto-files"),
    ],
});

const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const libraryPackage = grpcObj.library;

// gRPC HANDLERS
const handler = {
    async createBook(call: any, callback: grpc.sendUnaryData<any>) {
        try {
            const payload = call.request;
            const saved = await Book.create({
                title: payload.title,
                author: payload.author,
                isbn: payload.isbn,
                publishedYear: payload.publishedYear,
                summary: payload.summary,
            });

            callback(null, {
                id: saved.id.toString(),
                title: saved.title,
                author: saved.author,
                isbn: saved.isbn,
                publishedYear: saved.publishedYear,
                summary: saved.summary,
            });
        } catch (err) {
            console.error("CREATE ERROR:", err);
            callback({ code: grpc.status.INTERNAL, message: String(err) });
        }
    },

    async getBook(call: any, callback: grpc.sendUnaryData<any>) {
        try {
            const id = Number(call.request.id);
            const book = await Book.findByPk(id);

            if (!book)
                return callback({ code: grpc.status.NOT_FOUND, message: "Book not found" }, null);

            const b = book.toJSON();
            callback(null, {
                id: b.id.toString(),
                title: b.title,
                author: b.author,
                isbn: b.isbn,
                publishedYear: b.publishedYear,
                summary: b.summary,
            });
        } catch (err) {
            console.error("GET ERROR:", err);
            callback({ code: grpc.status.INTERNAL, message: String(err) });
        }
    },

    async updateBook(call: any, callback: grpc.sendUnaryData<any>) {
        try {
            const id = Number(call.request.id);
            const { title, author, isbn, publishedYear, summary } = call.request;
            const book: any = await Book.findByPk(id);

            if (!book)
                return callback({ code: grpc.status.NOT_FOUND, message: "Book not found" }, null);

            await book.update({
                title: title ?? book.title,
                author: author ?? book.author,
                isbn: isbn ?? book.isbn,
                publishedYear: publishedYear ?? book.publishedYear,
                summary: summary ?? book.summary,
            });

            const b = book.toJSON();
            callback(null, {
                id: b.id.toString(),
                title: b.title,
                author: b.author,
                isbn: b.isbn,
                publishedYear: b.publishedYear,
                summary: b.summary,
            });
        } catch (err) {
            console.error("UPDATE ERROR:", err);
            callback({ code: grpc.status.INTERNAL, message: String(err) });
        }
    },

    async deleteBook(call: any, callback: grpc.sendUnaryData<any>) {
        try {
            const id = Number(call.request.id);
            await Book.destroy({ where: { id } });
            callback(null, {}); // google.protobuf.Empty
        } catch (err) {
            console.error("DELETE ERROR:", err);
            callback({ code: grpc.status.INTERNAL, message: String(err) });
        }
    },

    async listBooks(call: any, callback: grpc.sendUnaryData<any>) {
        try {
            const page = call.request.page || 1;
            const pageSize = call.request.pageSize || 10;

            const { rows, count } = await Book.findAndCountAll({
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

            callback(null, {
                books: rows.map(b => ({
                    id: b.id.toString(),
                    title: b.title,
                    author: b.author,
                    isbn: b.isbn,
                    publishedYear: b.publishedYear,
                    summary: b.summary,
                })),
                total: count,
            });
        } catch (err) {
            console.error("LIST ERROR:", err);
            callback({ code: grpc.status.INTERNAL, message: String(err) });
        }
    },
};

//grpcServer.addService(libraryProto.LibraryService.service, {
  //  Login: authController.login,
    //Register: authController.register,
    // Auth API (No Middleware)
    //Login: AuthController.login,
    //Register: AuthController.register,

    // Protected Book APIs
    //CreateBook: (call, callback) =>
      //  AuthMiddleware(call, callback, () => BookController.create(call, callback)),

    //GetBook: (call, callback) =>
      //  AuthMiddleware(call, callback, () => BookController.get(call, callback)),

    //UpdateBook: (call, callback) =>
      //  AuthMiddleware(call, callback, () => BookController.update(call, callback)),

    //DeleteBook: (call, callback) =>
      //  AuthMiddleware(call, callback, () => BookController.delete(call, callback)),

    //ListBooks: (call, callback) =>
      //  AuthMiddleware(call, callback, () => BookController.list(call, callback)),
//});


// START SERVER
const startServer = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("Sequelize models synced with MySQL!");

    const server = new grpc.Server();
    server.addService(libraryPackage.LibraryServices.service, {
        handler,
         Login: authController.login,
        Register: authController.register,

        // Book APIs WITH Middleware
        CreateBook: (call: any, callback: any) =>
            AuthMiddleware(call, callback, () => BookController.create(call, callback)),

        GetBook: (call: any, callback: any) =>
            AuthMiddleware(call, callback, () => BookController.get(call, callback)),

        UpdateBook: (call: any, callback: any) =>
            AuthMiddleware(call, callback, () => BookController.update(call, callback)),

        DeleteBook: (call: any, callback: any) =>
            AuthMiddleware(call, callback, () => BookController.delete(call, callback)),

        ListBooks: (call: any, callback: any) =>
            AuthMiddleware(call, callback, () => BookController.list(call, callback)),
        
        
});

    const port = process.env.GRPC_PORT || "50051";
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`gRPC Server running on port ${port}`);
    });
};

startServer();