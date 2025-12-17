import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";


let client: MongoClient;
let dB: Db;
const dbName: string = "ExamPractice";

dotenv.config();


export const connectMongoDB = async () => {
    try {

        const mongoURL = process.env.MONGO_URL;
        if (!mongoURL) return console.log("It dont exist blud");

        client = new MongoClient(mongoURL);
        dB = client.db(dbName);
        console.log("Connected to the mongo this gonna bring all the huzz");


    } catch (err) {
        console.log("Error en el mongo scaring the huzz", err);
    }
}

export const getDB = () => dB;

export const closeMongoDB = async () => {
    try {
        client && await client.close();
    } catch (err) {
        console.log("Error en el mongo scaring the huzz", err);
    }
}