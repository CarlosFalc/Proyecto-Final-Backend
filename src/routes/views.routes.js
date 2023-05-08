import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager("products.json");

const router = Router();

router.get("/",async(req,res)=>{
    const objectProducts = await productManager.getProducts();
    res.render("home", {
        Services: objectProducts
    });
});

router.get("/realtimeproducts",async(req,res)=>{
    const objectProducts = await productManager.getProducts();
    res.render("realtimeproducts", {
        Services: objectProducts
    });
});

// endpoint para agregar el producto
router.post("/",async(req,res)=>{
    try {
        const {title,description,code,price,status,stock,category} = req.body;
        if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({status:"error", message:"Los campos no son validos"})
        }
        const newProduct = req.body;
        const productSaved = await productManager.addProduct(newProduct);
        res.json({status:"success", data:productSaved});
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

router.delete("/:pid",async(req,res)=>{
    try {
    const id = req.params.pid;
    const productDelete = await productManager.deleteProduct(id);
    res.json({status:"success", result:productDelete.message});
    } catch(error){
        res.status(400).json({status:"error", message:error.message});
    }
});

export { router as viewsRouter };