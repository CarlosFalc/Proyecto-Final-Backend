import {Router} from "express";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager("products.json");

const router = Router();

router.get("/", async(req,res)=>{
    try {
        const products = await productManager.getProducts();
        res.json({status:"success", data:products});
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

// http:localhost:8080/api/products?limit=
router.get("/api/products?limit",async(req,res)=>{
    try {
        console.log(req.query);
        const limit = req.query.limit;
        const product = await productManager.filter(p => p.limit === limit);
        res.send(product);
    } catch(error){
        res.status(400).json({status:"error", message:error.message});
    }
});

// http:localhost:8080/api/products/id=1
router.get("/api/products/:id",async(req,res)=>{
try {
    const id = req.params.pid;
    const product = await productManager.find(p=>p.id === id);
    res.send(product);
} catch(error){
    res.status(400).json({status:"error", message:error.message});
}
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

router.put("/api/products/:id", async(req,res)=>{
    try {
    const id = req.params.id;
    const updateProduct = req.body;
    const productIndex = await product.updateProduct(id, updateProduct);
    return (productIndex);
    } catch(error){
        res.status(400).json({status:"error", message:error.message});
    }
});

router.delete("/api/products/:id",async(req,res)=>{
    try {
    const id = req.params.id;
    const productId = await productManager.deleteProduct(id);
    return (productId);
    } catch(error){
        res.status(400).json({status:"error", message:error.message});
    }
});

export{router as productRouter};