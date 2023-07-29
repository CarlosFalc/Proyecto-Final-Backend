import { Router } from "express";
// import { userModel } from "../dao/models/user.model.js";
// import { createHash } from "../utils.js";
// import { isValidPassword } from "../utils.js";
import passport from "passport";


const router = Router();


router.post("/register", passport.authenticate("registerStrategy", {failureRedirect: "/api/sessions/register-failed"}), (req, res)=>{
    res.send(`<div> usuario registrado exitosamente, <a href= "/login">Ir al login</a></div>`);
});

router.get("/register-failed", (req, res)=>{
    res.send(`<div> error al registrarse, <a href= "/register">intente de nuevo</a></div>`);
});

router.post("/login", passport.authenticate("loginStrategy", {failureRedirect: "/api/sessions/login-failed"}), (req, res)=>{
    res.redirect("/products?page=1");
});

router.get("/login-failed", (req, res)=>{
    res.send(`<div> error al iniciar sesión, <a href= "/login">intente de nuevo</a></div>`);
});


router.get("/logout",(req, res)=>{

    req.logOut(error=>{

            if (error) {
                return res.send(`No se pudo cerrar sesión  <a href= "/products">Ir al perfil</a>`);
            } else {
                req.session.destroy(error=>{
                    if (error) {
                        return res.send(`No se pudo cerrar sesión  <a href= "/products">Ir al perfil</a>`)};
                        res.redirect("/");
                });
            }
    })   
});

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