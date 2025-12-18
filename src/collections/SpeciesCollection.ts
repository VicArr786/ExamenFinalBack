import { ObjectId } from "mongodb";
import { getDB } from "../mongo";
import { PokemonSpecies } from "../types/Pokemon";

const coleccion = () => getDB().collection<PokemonSpecies>("Species");

export const addSpecies = async (species: PokemonSpecies) => {
    if (!species.name) throw new Error("No name provided cuh");
    if (!species.types || !species.types.length  ) throw new Error("No types provided cuh");
    //if(!species.types != ) throw new Error("Incorrect types provided");
    const result = await coleccion().insertOne(species);
    return { ...species, _id: result.insertedId };
};

export const getSpeciesById = async (id: string) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid Species ID cuh");
    const species = await coleccion().findOne({ _id: new ObjectId(id) });
    if (!species) throw new Error("Species not found cuh");
    return species;
};

export const getAllSpecies = async () => {
        const limit = 10;
        const page = 10;
        return await coleccion().find().toArray();

};