import { ObjectId } from "mongodb";
import { getDB } from "../mongo"
import { Clothing } from "../types/Clothing"

const coleccion = () => getDB().collection<Clothing>("clothings");

export const validateclothingBelongsToUser = async (idclothing: string, idUser: string) => {
    const clothing = await coleccion().findOne({ _id: new ObjectId(idclothing) });
    if (!clothing) {
        throw new Error("Blud no clothing with that id exist re check dummy");
    }
    if (idUser !== clothing.idUser) {
        throw new Error("Aint urs blud");
    }
}

export const addclothing = async (clothing: Clothing) => {
    const result = await coleccion().insertOne(clothing);
    // Return the object with the new _id
    return { ...clothing, _id: result.insertedId };
}

export const buyClothingInDB = async (clothingId: string, newOwnerId: string) => {
    const result = await coleccion().updateOne(
        { _id: new ObjectId(clothingId) },
        { $set: { idUser: newOwnerId } }
    );
    if (result.matchedCount === 0) throw new Error("Clothing not found blud ");
    return true;
}

export const deleteclothing = async (id: string) => {
    const oldclothing = await coleccion().findOne({ _id: new ObjectId(id) });
    await coleccion().deleteOne({ _id: new ObjectId(id) });
    return oldclothing;
}