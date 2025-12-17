// src/graphql/schema.ts
import { gql } from "apollo-server"

export const typeDefs = gql`

    type User {
        _id: ID!
        nombre: String
        email: String
    }

    type Post {
        _id: ID!
        titulo: String
        contenido: String
        autor: String
        fechaCreacion: String
        idUser: String
    }

    input inPost {
        titulo: String
        contenido: String
        autor: String
        fechaCreacion: String
    }

    type Query {
        me: User
        getPosts: [Post]!
        getPost(id: ID!): Post
    }

    type Mutation {
        register(nombre: String!, email: String!, password: String!): String!
        login(email: String!, password: String!): String!
        addPost(post: inPost!): Post!
        updatePost(id: ID!, updates: inPost!): Post!
        deletePost(id: ID!): Post!
    }

`