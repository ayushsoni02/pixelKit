import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGO_URL;

if(!MONGODB_URL){
    throw new Error("Check your database Connection String");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {con:null,promise:null}
}