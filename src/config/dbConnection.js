import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../utils/logger.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(config.mongo.mongoUrl);
        logger.info("Base de datos conectada");
    } catch (error) {
        logger.fatal(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}