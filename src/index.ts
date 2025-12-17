// src/index.ts
import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import { connectMongoDB } from "./mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./auth";

dotenv.config();

const start = async () => {
    await connectMongoDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        // Pasamos user en el context a partir del token JWT
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;

            const user = token ? await getUserFromToken(token) : null;

            return { req, user };
        },
    });

    const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
    const { url } = await server.listen({ port: PORT });
    console.log(`GraphQL API lista en ${url}`);
};

start().catch((err) => console.error(err));