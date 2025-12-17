import { ObjectId } from "mongodb";
import { Clothing } from "./Clothing";

export type User = {
    _id?: ObjectId;
    email: string;
    clothes: Clothing[];
}