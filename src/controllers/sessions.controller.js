import { Usermongo } from "../dao/managers/users.mongo.js";
import { generateEmailToken } from "../utils/message.js";
import { sendRecoveryEmail } from "../utils/message.js";
import { verifyEmailToken, validPassword, createHash } from "../utils.js";

const userManager = new Usermongo();

export const sendRecovery = async(req, res)=>{
    const {email} = req.body;
    try {
        if (!email) {
            return res.send("Favor ingresar un correo electrónico <a href=/forgot-password>volver</a>");
        }
        const user = await userManager.getUserByEmail(email);
        const token = generateEmailToken(email, 180);
        await sendRecoveryEmail(email, token);
        res.send("Se ha enviado un link a tu correo electrónico")
    } catch (error) {
        res.json({status: "error", message: error.message});
    }
};

export const resetPassword = async(req, res)=>{
    try {
        const token = req.query.token;
        const {newPassword} = req.body;
        const userEmail = verifyEmailToken(token);

        if (!userEmail) {
            return res.send("El link caducó, debes generar un nuevo <a href=`/forgot-password`>link</a>");
        }
        
        const user = await userManager.getUserByEmail(userEmail);
        console.log(newPassword);
        if (validPassword(newPassword, user)) {
            return res.render("resetPass", {error: "La nueva contraseña debe ser distinta a la anterior", token});
        } 

        const newUser = {
            ...user,
            password: createHash(newPassword)
        };
        const userUpdated = await userManager.updateUser(user._id, newUser);
        console.log(userUpdated);
        res.redirect("/login");
        
    } catch (error) {
        res.send("no se pudo restablecer la contraseña");
    }    
};