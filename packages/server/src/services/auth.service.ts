import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

class AuthService {
    // Register a new user
    async register(data: { username: string; email: string; password: string }) {
        const { username, email, password } = data;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new Error("User already exists");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = this.generateToken(newUser);

        return {
            message: "User registered successfully",
            token,
        };
    }

    // Login existing user
    async login(data: { email: string; password: string }) {
        const { email, password } = data;

        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid password");

        const token = this.generateToken(user);

        return {
            message: "Login successful",
            token,
        };
    }

    // Generate JWT token
    generateToken(user: { id: number; email: string }) {
        return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1d",
        });
    }

    // Verify token
    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default new AuthService();
