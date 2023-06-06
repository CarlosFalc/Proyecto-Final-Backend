import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();



router.post("/register", async(req, res)=>{
    try {
        const userForm = req.body;
        const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

	if( !validEmail.test(userForm.email) ){
		alert(`${userForm.email} no cumple con el formato de correo electrónico`);
    }else{
        const user = await userModel.findOne({email:userForm.email});

        if (!user) {

            if (userForm.email.endsWith("@coder.com") && userForm.password.startsWith("adminCod3r")) {
                userForm.role = "admin";
                const userCreated = await userModel.create(userForm);
                console.log(userCreated);
                res.send(`<div> usuario registrado exitosamente, <a href= "/login">Ir al login</a></div>`);
            }else{

            const userCreated = await userModel.create(userForm);

            console.log(userCreated);

            res.send(`<div> usuario registrado exitosamente, <a href= "/login">Ir al login</a></div>`);
                }
        }else{
            res.send(`<div> usuario ya registrado anteriormente, <a href= "/register">Ir a Registrarse</a></div>`);
        }}
    } catch (error) {
        res.send(`<div> error al registrarse, <a href= "/register">intente de nuevo</a></div>`);
    }
});

router.post("/login", async(req, res)=>{
    try {
        const userLoginForm = req.body;
        const userDB = await userModel.findOne({email: userLoginForm.email});

        if (userDB) {
            
                if (userDB.password === userLoginForm.password) {
                    req.session.user = {first_name: userDB.first_name, last_name: userDB.last_name, age: userDB.age, email: userDB.email, role: userDB.role};
                    res.redirect("/products");
                } else {
                    res.send(`<div> contraseña incorrecta <a href= "/register">Ir a Registrarse</a> o <a href= "/login">Intente de nuevo</a></div>`);
                }

        } else {
            res.send(`<div> usuario no registrado, <a href= "/register">Ir a Registrarse</a> o <a href= "/login">Intente de nuevo</a></div>`);
        }

    } catch (error) {
        res.send(`<div> error al iniciar sesión, <a href= "/login">intente de nuevo</a></div>`);
    }
});

router.get("/logout",(req, res)=>{

    req.session.destroy(error=>{
        if (error) {
            return res.send(`No se pudo cerrar sesión  <a href= "/products">Ir al perfil</a>`)};
            res.redirect("/");
    });
});
export {router as authRouter};