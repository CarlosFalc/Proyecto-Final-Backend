import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email}, config.server.secretToken, {expiresIn: expireTime});
    return token;
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.gmail.adminEmail,
        pass: config.gmail.adminPass
    },
    secure: false,
    tls:{rejectUnauthorized: false}
});

export const sendRecoveryEmail = async(userEmail, token)=>{
    const link = `https://proyecto-final-backend-carlos-falcon.onrender.com/reset-password?token=${token}`;

    await transporter.sendMail({
        from: "Servicios de Armados / Instalaciones",
        to: userEmail,
        subject: "Restablecer contraseña",
        html:`
                <div>
                    <h2>Hola, aquí puedes restablecer tu contraseña</h2>
                    <p>Has clic aquí para restablecer tu contraseña</p>
                    <a href="${link}">
                        <button>Restablecer Contraseña</button>
                    </a>
                </div>
        `
    })
};

export const deleteInactivityEmail = async(userEmail)=>{
  
    const link = `https://proyecto-final-backend-carlos-falcon.onrender.com/signup`;
    
    await transporter.sendMail({
        from: "Servicios de Armados / Instalaciones",
        to: userEmail,
        subject: "Cuenta eliminada por inactividad",
        html:`
                <div>
                    <h2>Cuenta Eliminada</h2>
                    <p>Hola, tu cuenta fué eliminada por inactividad, si quieres volver a registrarte puedes hacerlo a través del siguiente enlace</p>
                    <a href="${link}">
                        <button>Ir a la página</button>
                    </a>
                </div>
        `
    })
};

export const deletedProductEmail = async(userEmail)=>{
  
    const link = `https://proyecto-final-backend-carlos-falcon.onrender.com/login`;
    
    await transporter.sendMail({
        from: "Servicios de Armados / Instalaciones",
        to: userEmail,
        subject: "Producto Eliminado",
        html:`
                <div>
                    <h2>Producto Eliminado</h2>
                    <p>Hola, tu producto ha sido eliminado de la página, puedes verificarlo a través del siguiente enlace</p>
                    <a href="${link}">
                        <button>Ir a la página</button>
                    </a>
                </div>
        `
    })
};