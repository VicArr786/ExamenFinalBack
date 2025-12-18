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
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || "";

            // Extract token regardless of whether 'Bearer ' prefix is present
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;
            const user = token ? await getUserFromToken(token) : null;
            return { user };
        },
    });

    const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

    const { url } = await server.listen({ port: PORT });
    console.log(`GraphQl ready this has the huzz ${url}`);
};

start().catch((err) => {
    console.error("Wrong u scared the huzz", err);
});