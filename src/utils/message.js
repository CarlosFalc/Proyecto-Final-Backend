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
    const link = `http://localhost:8080/reset-password?token=${token}`;

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
}