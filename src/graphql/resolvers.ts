import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import * as TrainerModel from "../collections/TrainerCollection";
import * as SpeciesModel from "../collections/SpeciesCollection";
import * as PokemonModel from "../collections/PokemonCollection";
import {randomInt} from "node:crypto";
import {validateTrainer} from "../collections/TrainerCollection";
import {getDB} from "../mongo";

const JWT_SECRET = "pikachu_secret_key";
const coleccion = () => getDB().collection("Species");

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: { user: any }) => {
            if (!context.user) throw new GraphQLError("Not authenticated");
            return await TrainerModel.findTrainerById(context.user.id);
        },
        pokemons: async () => await SpeciesModel.getAllSpecies() /*{
            const db = getDB();
            return db.collection("Species").find().toArray();
            //await coleccion().find().toArray()
        }*/,
        pokemon: async (_: any, args: { id: string }) => await SpeciesModel.getSpeciesById(args.id),

    },

    Mutation: {
        startJourney: async (_: any, args: any) => {
            const id = await TrainerModel.createTrainer(args.name, args.password);
            return jwt.sign({ id, name: args.name }, JWT_SECRET, { expiresIn: "1d" });
        },
        login: async (_: any, args: any) => {
            const trainer = await TrainerModel.validateTrainer(args.name, args.password);
            if (!trainer) throw new GraphQLError("Invalid credentials");
            return jwt.sign({ id: trainer._id.toString(), name: trainer.name }, JWT_SECRET, { expiresIn: "1d" });
        },
        createPokemon: async (_: any, args: any) => {
            return await SpeciesModel.addSpecies({ ...args });
        },
        catchPokemon: async (_: any, args: { pokemonId: string, nickname?: string }, context: { user: any }) => {
            if (!context.user) throw new GraphQLError("Not authenticated cuh");

            const species = await SpeciesModel.getSpeciesById(args.pokemonId);

            const newCaughtPokemon = {
                nickname: args.nickname || species.name,
                level: 1,
                attack: randomInt(1,100),
                defense: randomInt(1,100),
                special: randomInt(1,100),
                originalSpeciesId: args.pokemonId,
                capturedAt: new Date()
            };

            const savedPokemon = await PokemonModel.catchPokemon(newCaughtPokemon);
            await TrainerModel.addPokemonToTrainer(context.user.id, savedPokemon);
            return savedPokemon;
        },
        freePokemon: async (_: any, args: { ownedPokemonId: string }, context: { user: any }) => {
            if (!context.user) throw new GraphQLError("Not authenticated cuh ");
            await PokemonModel.freePokemon(args.ownedPokemonId);
            return await TrainerModel.removePokemonFromTrainer(context.user.id, args.ownedPokemonId);
        },
    },


};