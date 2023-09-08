import { Router } from "express";
import passport from "passport";
import { sendRecovery } from "../controllers/sessions.controller.js";
import { resetPassword } from "../controllers/sessions.controller.js";
import { Usermongo } from "../dao/managers/users.mongo.js";
import { uploadProfile } from "../utils.js";

const userManager = new Usermongo();

const router = Router();

router.post("/register", uploadProfile.single("avatar"), passport.authenticate("registerStrategy", {failureRedirect: "/api/sessions/register-failed"}), (req, res)=>{
    res.send(`<div> usuario registrado exitosamente, <a href= "/login">Ir al login</a></div>`);
});

router.get("/register-failed", (req, res)=>{
    res.send(`<div> error al registrarse, favor llenar todos lo campos y valide el formato de correo electrónico, <a href= "/register">intente de nuevo</a></div>`);
});

router.post("/login", passport.authenticate("loginStrategy", {failureRedirect: "/api/sessions/login-failed"}), (req, res)=>{
    res.send("Login exitoso");
});

router.get("/login-failed", (req, res)=>{
    res.send(`<div> error al iniciar sesión, <a href= "/login">intente de nuevo</a></div>`);
});


router.get("/logout", async(req, res)=>{
    try {
        
        req.user.last_connection = new Date();
        await userManager.updateUser(req.user._id, req.user);

        req.logOut(error=>{

            if (error) {
                return res.send(`No se pudo cerrar sesión  <a href= "/products?page=1">Ir al perfil</a>`);
            } else {
                req.session.destroy(error=>{
                    if (error) {
                        return res.send(`No se pudo cerrar sesión  <a href= "/products?page=1">Ir al perfil</a>`)};
                        res.redirect("/");
                });
            }
    });

    } catch (error) {
    res.status(500).json({status: "error", message: error.message});
    logger.error("mensaje de error");
    }
    
});

router.post("/forgot-password", sendRecovery);

router.post("/reset-password", resetPassword);

router.get("/current", (req, res)=>{
    if(!req.user){
        res.send(`<div> por favor, <a href= "/login">iniciar sesión</a></div>`);
    }else{
        res.render("current", {user: JSON.parse(JSON.stringify(req.user))});
    }
});

// //Ruta login con github
// router.get("/github",passport.authenticate("githubLogin"));

// router.get("/github-callback", passport.authenticate("githubLogin", {failureRedirect:"/api/sessions/login-failed"}), (req, res)=>{
//     res.redirect("/products");
// });
export {router as authRouter};