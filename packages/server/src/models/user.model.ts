import { DataType, DataTypes } from "sequelize";
import {sequelize} from "../config/db";

const User = sequelize.define("User",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,

    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "users",
    timestamps: true
});

export {User};