import "reflect-metadata";
import { DataSource } from "typeorm";
import {Book} from "./entity/Book";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    username : process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database : process.env.DB_NAME || "librarydb",
    synchronize: true, 
    logging: false,
    entities: [Book],


});
