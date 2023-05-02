import { Router } from "express";

const router = Router();

const services = [
    { title: "Armado de muebles", description: "Servicios de armado Sodimac", code: 6441009, price: "32.990", stock: 1500, category: "Muebles", thumbnail: "https://sodimac.scene7.com/is/image/SodimacCL/6441009_01?wid=1500&hei=1500&qlt=70", id: 1 },
    { title: "Instalación de Calefont", description: "Servicios de instalación Sodimac", code: 3686213, price: "74.990", stock: 1000, category: "Baño y Cocina", thumbnail: "https://sodimac.falabella.com/sodimac-cl/product/110685359/Instalacion-Calefon-Tiro-Natural/110685363?sid=SO_HO_BPD_106641", id: 2 },
    { title: "Instalación de Sanitarios", description: "Servicios de instalación Sodimac", code: 3686175, price: "51.990", stock: 900, category: "Baño y Cocina", thumbnail: "https://sodimac.scene7.com/is/image/SodimacCL/3686175_01?wid=1500&hei=1500&qlt=70", id: 3 },
];

router.get("/",(req,res)=>{
    const objectProducts = { services }
    res.render("home",objectProducts);
});

export { router as viewsRouter };