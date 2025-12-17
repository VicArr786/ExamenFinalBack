// src/auth.ts
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getDB } from "./mongo";
import { ObjectId } from "mongodb";

dotenv.config();
const SECRET = process.env.JWT_SECRET;

type TokenPayload = {
    userId: string;
};

export const signToken = (userId: string) => {
    if (!SECRET) {
        console.error("THERE AINT NO JWT_SECRET en el .env cuh" );
        return;
    }
    return jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): TokenPayload | null => {
    if (!SECRET) {
        console.error("THERE AINT NO JWT_SECRET en el .env cuh");
        return null;
    }

    try {
        return jwt.verify(token, SECRET) as TokenPayload;
    } catch (err) {
        return null;
    }
};

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if (!payload) return null;

    const db = getDB();
    return await db
        .collection("UsersPosts")
        .findOne({ _id: new ObjectId(payload.userId) });
};