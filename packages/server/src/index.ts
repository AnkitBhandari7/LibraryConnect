import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AppDataSource } from "./data-source";
import { Book } from "./entity/Book";

const PROTO_PATH = __dirname + "/../../proto/library.proto";

const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const libraryPackage = grpcObj.library;

async function main() {
    await AppDataSource.initialize();
    const bookRepo = AppDataSource.getRepository(Book);
    const server = new grpc.Server();
    const handler = {
        async CreateBook(
            call: any,
            callback: grpc.sendUnaryData<any>

        ) {
            const payload = call.request;
            const b = bookRepo.create({
                title: payload.title,
                author: payload.author,
                isbn: payload.isbn,
                publishedYear: payload.publishedYear,
                summary: payload.summary,
            });
            const saved = await bookRepo.save(b);
            callback(null, {
                id: saved.id,
                title: saved.title,
                author: saved.author,
                isbn: saved.isbn,
                publishedYear: saved.publishedYear,
                summary: saved.summary,
            });


        },
        async GetBook(call: any, callback: grpc.sendUnaryData<any>) {
            const { id } = call.request;
            const book = await bookRepo.findOneBy({ id: Number(id) });
            if (!book) return callback({ code: grpc.status.NOT_FOUND, message: "Not found" } as any);
            callback(null, book);
        },
        async UpdateBook(call: any, callback: grpc.sendUnaryData<any>) {
            const { id, title, author, isbn, publishedYear, summary } = call.request;
            const book = await bookRepo.findOneBy({ id: Number(id) });
            if (!book) return callback({ code: grpc.status.NOT_FOUND, message: "Not found" } as any);
            book.title = title ?? book.title;
            book.author = author ?? book.author;
            book.isbn = isbn ?? book.isbn;
            book.publishedYear = publishedYear ?? book.publishedYear;
            book.summary = summary ?? book.summary;
            const saved = await bookRepo.save(book);
            callback(null, saved);

        },

        async DeleteBook(call: any, callback: grpc.sendUnaryData<any>) {
            const { id } = call.request;
            await bookRepo.delete(Number(id));
            callback(null, {}); // google.protobuf.Empty 
        },
        async ListBooks(call: any, callback: grpc.sendUnaryData<any>) {
            const page = call.request.page || 1;
            const pageSize = call.request.pageSize || 10;
            const [items, total] = await bookRepo.findAndCount({
                skip: (page - 1) * pageSize,
                take: pageSize,

            });
            callback(null, { books: items, total });

        },
    };
    server.addService(libraryPackage.LibraryService.service, handler);
    const port = process.env.GRPC_PORT || "50051";
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`grpc server started on {$port}`);

    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


