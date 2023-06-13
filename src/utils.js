import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Función para crear el hash
export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

//Función para comparar las contraseñas
export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password);
};