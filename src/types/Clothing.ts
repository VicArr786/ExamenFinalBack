import { ObjectId } from "mongodb";

export type Clothing = {
    _id?: ObjectId;
    name: string;
    size: string;
    color: string;
    price: number;
    idUser?: string;
}