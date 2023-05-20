import {Router} from "express";
import { CartFiles } from "../dao/managers/carts.files.js";
import { ProductsFiles } from "../dao/managers/products.files.js";
//import { CartManager } from "../managers/cartManager.js";
//import { ProductManager } from "../managers/ProductManager.js";

const cartsService = new CartFiles();
const productsService = new ProductsFiles();
//const cartManager = new CartManager("carts.json");
//const productManager = new ProductManager("products.json");

const router = Router();

router.post("/",async(req,res)=>{
    try {
        const cartCreated = await cartsService.addCart();
        res.json({status:"success", data:cartCreated});
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

router.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        if(cart){
            res.json({status:"success", data:cart});
        } else {
            res.status(400).json({status:"error", message:"el carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

router.post("/:cid/product/:pid", async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCartById(cartId);
        if(cart){
            const product = await productsService.getProductById(productId);
            if(product){
                const response  = await cartsService.addProductToCart(cartId,productId);
                res.json({status:"success", message:response});
            } else {
                res.status(400).json({status:"error", message:"No es posible agregar este producto"});
            }
        } else {
            res.status(400).json({status:"error", message:"el carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

export{router as cartRouter};
