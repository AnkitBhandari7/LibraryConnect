import * as grpc from "@grpc/grpc-js";
import {
    LibraryServicesService,
    LibraryServicesServer,
    Book,
    CreateBookRequest,
    GetBookRequest,
    UpdateBookRequest,
    DeleteBookRequest,
    ListBookRequest,
    ListBookResponse,
} from "./proto/library";

// Implement the gRPC server
const libraryService: LibraryServicesServer = {
    createBook: (call, callback) => {
        const req: CreateBookRequest = call.request;
        const book: Book = { ...req };
        callback(null, book);
    },

    getBook: (call, callback) => {
        const req: GetBookRequest = call.request;
        const book: Book = {
            id: req.id,
            title: "Example Book",
            author: "Author Name",
            isbn: "1234567890",
            publishedYear: 2025,
            summary: "This is a sample book.",
        };
        callback(null, book);
    },

    updateBook: (call, callback) => {
        const req: UpdateBookRequest = call.request;
        const book: Book = { ...req };
        callback(null, book);
    },

    deleteBook: (call, callback) => {
        const req: DeleteBookRequest = call.request;
        callback(null, {}); // google.protobuf.Empty
    },

    listBooks: (call, callback) => {
        const req: ListBookRequest = call.request;
        const response: ListBookResponse = {
            books: [
                {
                    id: 1,
                    title: "Book 1",
                    author: "Author 1",
                    isbn: "111111",
                    publishedYear: 2023,
                    summary: "Sample book 1",
                },
            ],
            total: 1,
        };
        callback(null, response);
    },
};

// Start gRPC server
function main() {
    const server = new grpc.Server();
    server.addService(LibraryServicesService, libraryService);

    const port = "50051";
    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`  gRPC server running on port ${port}`);
            server.start();
        }
    );
}

main();
