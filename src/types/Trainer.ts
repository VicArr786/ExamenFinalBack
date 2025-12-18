import { ObjectId } from "mongodb";
import { CaughtPokemon } from "./Pokemon";

export interface Trainer {
    _id?: ObjectId;
    name: string;
    passwordHash: string;
    token?: string;
    pokemons: CaughtPokemon[];
}