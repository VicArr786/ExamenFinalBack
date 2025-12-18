import { ObjectId } from "mongodb";

export interface PokemonSpecies {
    _id?: ObjectId;
    name: string;
    description: string;
    height: number;
    weight: number;
    types: string[];
}

export interface CaughtPokemon {
    _id?: ObjectId;
    originalSpeciesId: string;
    nickname?: string;
    level: number;
    capturedAt: Date;
}