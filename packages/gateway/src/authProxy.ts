import { client } from "./grpcClient";
import { Request, Response } from "express";


export const login = (req: Request, res: Response) => {
    client.Login(req.body, (err: any, data: any) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(data);
    });
};

export const register = (req: Request, res: Response) => {
    client.Register(req.body, (err: any, data: any) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(data);
    });
};
