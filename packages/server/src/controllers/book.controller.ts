import { Book } from "../models/Book";
import { grpc } from "@grpc/grpc-js";

class BookController {

    // CREATE BOOK
    static async create(call: any, callback: any) {
        try {
            const { title, author, summary, isbn, publishedYear } = call.request;

            const newBook = await Book.create({
                title,
                author,
                summary,
                isbn,
                publishedYear,
                userId: call.user?.id 
            });

            return callback(null, newBook.toJSON());
        } catch (err: any) {
            console.error("CREATE BOOK ERROR:", err);
            return callback({ code: grpc.status.INTERNAL, message: "Failed to create book" });
        }
    }

    // GET BOOK BY ID
    static async get(call: any, callback: any) {
        try {
            const id = Number(call.request.id);
            const book = await Book.findByPk(id);

            if (!book) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Book not found" });
            }

            return callback(null, book.toJSON());
        } catch (err: any) {
            console.error("GET BOOK ERROR:", err);
            return callback({ code: grpc.status.INTERNAL, message: "Failed to get book" });
        }
    }

    // UPDATE BOOK
    static async update(call: any, callback: any) {
        try {
            const id = Number(call.request.id);
            const book = await Book.findByPk(id);

            if (!book) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Book not found" });
            }

            await book.update(call.request);
            return callback(null, book.toJSON());
        } catch (err: any) {
            console.error("UPDATE BOOK ERROR:", err);
            return callback({ code: grpc.status.INTERNAL, message: "Failed to update book" });
        }
    }

    // DELETE BOOK
    static async delete(call: any, callback: any) {
        try {
            const id = Number(call.request.id);
            const deleted = await Book.destroy({ where: { id } });

            if (!deleted) {
                return callback({ code: grpc.status.NOT_FOUND, message: "Book not found" });
            }

            return callback(null, {}); // Return empty object
        } catch (err: any) {
            console.error("DELETE BOOK ERROR:", err);
            return callback({ code: grpc.status.INTERNAL, message: "Failed to delete" });
        }
    }

    // LIST BOOKS
    static async list(call: any, callback: any) {
        try {
            const page = call.request.page || 1;
            const pageSize = call.request.pageSize || 10;

            const { count, rows } = await Book.findAndCountAll({
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

            return callback(null, {
                books: rows.map(b => b.toJSON()),
                total: count,
            });
        } catch (err: any) {
            console.error("LIST BOOK ERROR:", err);
            return callback({ code: grpc.status.INTERNAL, message: "Failed to list books" });
        }
    }
}

export default BookController;
