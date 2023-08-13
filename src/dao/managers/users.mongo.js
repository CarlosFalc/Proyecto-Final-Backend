import { userModel } from "../models/user.model.js";

export class Usermongo{

    constructor(){
        this.model = userModel;
    };

    async getUserByEmail(emailUser){
        try {
            const user = await this.model.findOne({email:emailUser});
            if (user) {
                return JSON.parse(JSON.stringify(user));
            } else {
                throw new Error("el usuario no existe");
            }
            
        } catch (error) {
            throw error;
        }

    };

    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error("el ususario no existe")
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };

    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }

    };

    async updateUser(userId, newInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId, newInfo, {new:true});
            if (!userUpdated) {
                throw new Error("usuario no encontrado");
            }
            return userUpdated;
        } catch (error) {
            throw error;
        }
    };
}