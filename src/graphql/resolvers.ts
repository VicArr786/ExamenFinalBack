import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import * as TrainerModel from "../collections/TrainerCollection";
import * as SpeciesModel from "../collections/SpeciesCollection";
import * as PokemonModel from "../collections/PokemonCollection";

const JWT_SECRET = "pikachu_secret_key";

export const resolvers = {
    Query: {
        pokemons: async () => await SpeciesModel.getAllSpecies(),
        pokemon: async (_: any, args: { id: string }) => await SpeciesModel.getSpeciesById(args.id),
        me: async (_: any, __: any, context: { user: any }) => {
            if (!context.user) throw new GraphQLError("Not authenticated");
            return await TrainerModel.findTrainerById(context.user.id);
        },
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
            if (!context.user) throw new GraphQLError("Not authenticated");

            const species = await SpeciesModel.getSpeciesById(args.pokemonId);

            const newCaughtPokemon = {
                nickname: args.nickname || species.name,
                level: 1,
                originalSpeciesId: args.pokemonId,
                capturedAt: new Date()
            };

            const savedPokemon = await PokemonModel.addCaughtPokemon(newCaughtPokemon);
            await TrainerModel.addPokemonToTrainer(context.user.id, savedPokemon);
            return savedPokemon;
        },
        freePokemon: async (_: any, args: { ownedPokemonId: string }, context: { user: any }) => {
            if (!context.user) throw new GraphQLError("Not authenticated");
            await PokemonModel.deleteCaughtPokemon(args.ownedPokemonId);
            return await TrainerModel.removePokemonFromTrainer(context.user.id, args.ownedPokemonId);
        },
    },

    CaughtPokemon: {
        species: async (parent: any) => {
            return await SpeciesModel.getSpeciesById(parent.originalSpeciesId);
        }
    }
};