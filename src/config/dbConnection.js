import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(config.mongo.mongoUrl);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}