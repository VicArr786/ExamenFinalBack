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
    attack : number;
    defense: number;
    speed: number;
    special: number;
    level: number;
    capturedAt: Date;

}
