import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Función para crear el hash
export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

//Función para comparar las contraseñas
export const validPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password);
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token, config.server.secretToken);
        return info.email;
    } catch (error) {
        return null;
    }
};