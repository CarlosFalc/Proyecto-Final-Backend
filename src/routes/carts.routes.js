import {Router} from "express";
// import { CartFiles } from "../dao/managers/carts.Files.js";
// import { ProductsFiles } from "../dao/managers/products.files.js";
import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";

// const cartsService = new CartFiles("carts.json");
// const productsService = new ProductsFiles('products.json');
const cartsService = new CartsMongo(CartModel);
const productsService = new ProductsMongo(ProductsModel);

const router = Router();


//agregar carrito
router.post("/",async(req,res)=>{
    try {
        const cartAdded = await cartsService.addCart();
        res.json({status:"success", result:cartAdded, message:"Carrito Agregado"});
        console.log(cartAdded);
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para listar todos los productos de un carrito
router.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        //obtenemos el carrito
        const cart = await cartsService.getCartById(cartId);
        if (cart) {
            res.json({status:"success", result:cart});
        } else {
            res.status(400).json({status: "error", message: "Este carrito no existe"})
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

//ruta para agregar un producto al carrito
router.put("/:cid/product/:pid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCartById(cartId);
        // console.log("cart: ", cart);
        if(cart) {
            const product = await productsService.getProductById(productId);
        // console.log("product: ", product);
            if(product) {
                const cartUpdated = await cartsService.addProductToCart(cartId, productId);
                res.json({status:"success", result:cartUpdated, message:"Producto Agregado"});
            } else {
                res.status(400).json({status: "error", message: "No se puede agregar este producto"});
            }
        } else{
            res.status(400).json({status: "error", message: "Este carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", menssage: error.message});
    }
});

// ruta para actualizar todos los productos de un carrito.
router.put("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartsService.getCartById(cartId);
        cart.products = [...products];
        const response = await cartsService.updateCart(cartId, cart);
        res.json({status:"success", result:response, message:"Carrito actualizado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        await cartsService.getCartById(cartId);
        await productsService.getProductById(productId);
        const response = await cartsService.updateQuantityInCart(cartId, productId, quantity);
        res.json({status:"success", result: response, message:"Producto actualizado"});
    } catch (error) {
        res.status(400).json({status:"error", message :error.message});
    }
});

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCartById(cartId);
        // console.log("cart: ", cart);
        if (cart) {
            const product = await productsService.getProductById(productId);
        // console.log("product: ", product);
            if (product) {
                const response = await cartsService.deleteProduct(cartId, productId);
                res.json({status:"success", result:response, message:"Producto eliminado"});
            } else {
                res.status(400).json({status: "error", message: "No se puede eliminar este producto"});
            }
        } else{
            res.status(400).json({status: "error", message: "Este carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

router.delete("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        cart.products=[];
        const response = await cartsService.updateCart(cartId, cart);
        res.json({status:"success", result: response, message:"Carrito eliminado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
});

export {router as cartsRouter};