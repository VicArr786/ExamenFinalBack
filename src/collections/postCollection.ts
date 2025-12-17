import { Collection, ObjectId } from "mongodb";
import { getDB } from "../mongo"
import { Post } from "../types/Post"

const coleccion = () => getDB().collection("Posts");



export const validatePostBelongsToUser = async (idPost: string, idUser: string) => {
    const post = await coleccion().findOne({ _id: new ObjectId(idPost) });
    if (!post) {
        throw new Error("Blud no post with that id exist re check dummy");
    }
    if (idUser != post.idUser) {
        throw new Error("Aint urs blud");
    }
}

export const addPost = async (post: Post) => {
    const result = await coleccion().insertOne(post);
    return await coleccion().findOne({ _id: result.insertedId });

}

export const updatePost = async (id: string, updates: Post) => {
    await coleccion().updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
    )

    return await coleccion().findOne({ _id: new ObjectId(id) });
}

export const deletePost = async (id: string) => {
    const oldPost = await coleccion().findOne({ _id: new ObjectId(id) });
    await coleccion().deleteOne({ _id: new ObjectId(id) });
    return oldPost;
}