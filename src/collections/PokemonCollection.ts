import { ObjectId } from "mongodb";
import { getDB } from "../mongo";

const COLECCION = "CaughtPokemons";

export const addCaughtPokemon = async (pokemonData: any) => {
    const db = getDB();
    const result = await db.collection(COLECCION).insertOne(pokemonData);
    return { ...pokemonData, _id: result.insertedId };
};

export const deleteCaughtPokemon = async (id: string) => {
    const db = getDB();
    await db.collection(COLECCION).deleteOne({ _id: new ObjectId(id) });
};