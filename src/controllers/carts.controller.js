import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";

//services
const cartsService = new CartsMongo();
const productsService = new ProductsMongo();

export const addCart = async(req,res)=>{
    try {
        const cartAdded = await cartsService.create();
        res.json({status:"success", data:cartAdded, message:"Carrito Agregado"});
        console.log(cartAdded);
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};

export const getCarts = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.get(cartId);
        if (cart) {
        res.json({status:"success", data:cart});
    } else{
        res.status(400).json({status: "error", message: "Este carrito no existe"})
    }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
};

export const addProductToCart = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.get(cartId);
        // verificar que el producto exista antes de agregarlo al carrito.
        const result = await cartsService.addProduct(cartId,productId);
        res.json({status:"success", data:result});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
};

export const updateCart = async(req,res)=>{
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
};

export const updateQuantityInCart = async(req,res)=>{
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
};

export const deleteProduct = async(req,res)=>{
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
};

export const deleteCart = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        cart.products=[];
        const response = await cartsService.updateCart(cartId, cart);
        res.json({status:"success", result: response, message:"Carrito eliminado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};