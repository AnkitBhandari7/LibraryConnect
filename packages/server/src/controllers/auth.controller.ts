import AuthService from "../services/auth.service";

const AuthController = {
    async register(call: any, callback: any) {
        try {
            const data = call.request;
            const response = await AuthService.register(data);
            return callback(null, response);
        } catch (error: any) {
            return callback({
                code: 400,
                message: error.message || "Registration failed",
            });
        }
    },

    async login(call: any, callback: any) {
        try {
            const data = call.request;
            const response = await AuthService.login(data);
            return callback(null, response);
        } catch (error: any) {
            return callback({
                code: 401,
                message: error.message || "Login failed",
            });
        }
    }
};

export default AuthController;
