import jwt from "jsonwebtoken";
import { getDB } from "./mongo";
import { ObjectId } from "mongodb";

const SECRET = "pikachu_secret_key";

export const getUserFromToken = async (token: string) => {
    try {

        const payload = jwt.verify(token, SECRET) as { id: string; name: string };

        if (!payload || !payload.id) return null;

        const db = getDB();
        // 2. Search in the "Trainers" collection, not "UsersPosts"
        const user = await db
            .collection("Trainers")
            .findOne({ _id: new ObjectId(payload.id) });

        // 3. Return the user (this becomes context.user)
        return user ? { ...user, id: user._id.toString() } : null;
    } catch (err) {
        return null;
    }
};