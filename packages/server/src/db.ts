import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || "librarydb",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false,
    }
);

// Test connection
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(" MySQL connected successfully via Sequelize!");
    } catch (error) {
        console.error(" Unable to connect to the database:", error);
    }
};
