import { ObjectId } from "mongodb";
import { getDB } from "../mongo";
import bcrypt from "bcryptjs";
import { Trainer } from "../types/Trainer";

const COLECCION = "Trainers";

export const createTrainer = async (name: string, password: string) => {
    const db = getDB();
    const encryptedPasswd = await bcrypt.hash(password, 10);

    const exists = await db.collection<Trainer>(COLECCION).findOne({ name } as any);
    if (exists) throw new Error("Be original blud name taken cuh");

    const result = await db.collection<Trainer>(COLECCION).insertOne({
        name,
        passwordHash: encryptedPasswd,
        pokemons: []
    } as any);

    return result.insertedId.toString();
};

export const validateTrainer = async (name: string, password: string) => {
    const db = getDB();
    const trainer = await db.collection<Trainer>(COLECCION).findOne({ name } as any);
    if (!trainer) return null;

    const valid = await bcrypt.compare(password, trainer.passwordHash);
    if (!valid) return null;

    return trainer;
};

export const findTrainerById = async (id: string) => {
    const db = getDB();
    if (!ObjectId.isValid(id)) return null;
    // 'as any' prevents the TypeScript error regarding _id types
    return await db.collection<Trainer>(COLECCION).findOne({ _id: new ObjectId(id) } as any);
};

export const addPokemonToTrainer = async (trainerId: string, pokemonData: any) => {
    const db = getDB();
    await db.collection<Trainer>(COLECCION).updateOne(
        { _id: new ObjectId(trainerId) } as any,
        { $push: { pokemons: pokemonData } }
    );
};

export const removePokemonFromTrainer = async (trainerId: string, pokemonId: string) => {
    const db = getDB();
    await db.collection<Trainer>(COLECCION).updateOne(
        { _id: new ObjectId(trainerId) } as any,
        { $pull: { pokemons: { _id: new ObjectId(pokemonId) } } as any }
    );
    return await findTrainerById(trainerId);
};