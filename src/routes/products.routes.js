import {Router} from "express";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager("products.json");

const router = Router();

// Obtener todos los productos, incluyendo la limitación ?limit
router.get("/", async(req,res)=>{
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;
        if(limit){
            let productsLimited =[];
            for(let i = 0; i < limit; i++){
                productsLimited.push(products[i]);
            }
            res.json({status:"success", data:productsLimited});
        }else{
            res.json({status:"success", data:products});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

// http:localhost:8080/api/products/id=1
router.get("/:pid",async(req,res)=>{
try {
    const id = req.params.pid;
    const product = await productManager.getProductById(id);
    if(product){
        res.json({status:"success", data:product});
        } else {
        res.status(400).json({status:"error", message:"El producto no existe"});
        }
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


router.put("/:pid", async(req,res)=>{
    try {
    const id = req.params.pid;
    const productUpdate = req.body;
    const productIndex = await productManager.updateProduct(id, productUpdate);
    return (productIndex);
    } catch(error){
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

export{router as productRouter};