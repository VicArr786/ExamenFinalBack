import { IResolvers } from "@graphql-tools/utils";
import { getDB } from "../mongo";
import { ObjectId } from "mongodb";
import { createUser, validateUser } from "../collections/userCollection";
import { signToken } from "../auth";
import { addPost, deletePost, updatePost, validatePostBelongsToUser } from "../collections/postCollection";


const coleccion = () => getDB().collection("Posts");

export const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) return null;
            return {
                _id: user._id.toString(),
                nombre: user.nombre,
                email: user.email
            }
        },
        getPosts: async () => await coleccion().find().toArray(),
        getPost: async (_, { id }) => await coleccion().findOne({ _id: new ObjectId(id) }),

    },


    Mutation: {

        register: async (_, { nombre, email, password }) => {
            const userId = await createUser(nombre, email, password);
            if (!userId){
                return "Be original lil bro";
            }
            return signToken(userId);
        },

        login: async (_, { email, password }) => {
            const user = await validateUser(email, password);
            if (!user){
                throw new Error("Wrong lil bro ");
            }
            return signToken(user._id.toString());
        },

        addPost: async (_, { post }, { user }) => {
            if (!user) {
                throw new Error("You aint logged in lil bro");
            }
            return await addPost({ ...post, idUser: user._id.toString() });
        },

        updatePost: async (_, { id, updates }, { user }) => {
            if (!user) {
                throw new Error("You aint logged in lil bro");
            }
            await validatePostBelongsToUser(id, user.id);
            return await updatePost(id, updates);
        },

        deletePost: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error("You aint logged in lil bro");
            }
            await validatePostBelongsToUser(id, user.id);
            return await deletePost(id);
        }
    }



}