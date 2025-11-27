import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Book = sequelize.define(
    "Book",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publishedYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "books",  
        timestamps: true,     
    }
);
