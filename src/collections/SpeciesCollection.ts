import { ObjectId } from "mongodb";
import { getDB } from "../mongo";
import { PokemonSpecies } from "../types/Pokemon";

const coleccion = () => getDB().collection<PokemonSpecies>("Species");

export const addSpecies = async (species: PokemonSpecies) => {
    const result = await coleccion().insertOne(species);
    return { ...species, _id: result.insertedId };
};

export const getSpeciesById = async (id: string) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid Species ID");
    const species = await coleccion().findOne({ _id: new ObjectId(id) });
    if (!species) throw new Error("Species not found");
    return species;
};

export const getAllSpecies = async () => {
    return await coleccion().find().toArray();
};