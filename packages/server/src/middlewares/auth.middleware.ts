import jwt from "jsonwebtoken";

export const AuthMiddleware = (call: any, callback: any, next: any) => {
    try {
        const authHeader = call.metadata.get("authorization")[0];

        if (!authHeader) {
            return callback({
                code: 401,
                message: "Authorization token missing"
            });
        }

       
        const token = authHeader.replace("Bearer ", "").trim();

        if (!token) {
            return callback({
                code: 401,
                message: "Invalid token format"
            });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // Attach user data for further use
        call.user = decoded;

        return next();
    } catch (error) {
        return callback({
            code: 401,
            message: "Unauthorized or Invalid Token"
        });
    }
};
