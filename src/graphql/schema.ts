import { gql } from "apollo-server";

export const typeDefs = gql`
    enum PokemonType {
        GRASS
        POISON
        FIRE
        WATER
        NORMAL
        FLYING
        ELECTRIC
        # Add others as needed
    }

    type PokemonSpecies {
        _id: ID!
        name: String!
        description: String!
        height: Float!
        weight: Float!
        types: [PokemonType!]!
    }

    type CaughtPokemon {
        _id: ID!
        nickname: String
        level: Int!
        species: PokemonSpecies!
        capturedAt: String
    }

    type Trainer {
        _id: ID!
        name: String!
        pokemons: [CaughtPokemon!]!
    }

    type Query {
        # Returns all pokedex entries
        pokemons: [PokemonSpecies!]!
        # Returns a specific pokedex entry by ID
        pokemon(id: ID!): PokemonSpecies
        # Returns the logged-in trainer's profile
        me: Trainer
    }

    type Mutation {
        # Registers a new trainer and returns a JWT
        startJourney(name: String!, password: String!): String!

        # Authenticates a trainer and returns a JWT
        login(name: String!, password: String!): String!

        # Adds a new species to the global database
        createPokemon(
            name: String!
            description: String!
            height: Float!
            weight: Float!
            types: [PokemonType!]!
        ): PokemonSpecies!

        # Captures a pokemon for the current trainer
        catchPokemon(pokemonId: ID!, nickname: String): CaughtPokemon!

        # Removes a pokemon from the trainer's collection
        freePokemon(ownedPokemonId: ID!): Trainer!
    }
`;