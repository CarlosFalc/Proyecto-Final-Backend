import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";
import { TicketMongo } from "../dao/managers/ticketManagerMongo.js"
import { v4 as uuidv4 } from "uuid";

//services
const cartsService = new CartsMongo();
const productsService = new ProductsMongo();
const ticketManager = new TicketMongo();
let myuuid = uuidv4();

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
        res.json({status:"success", cart:cart});
        console.log(cart);
    } else{
        res.status(400).json({status: "error", message: "Este carrito no existe"})
    }
    } catch (error) {
        res.status(500).json({status:"error", message:error.message});
    }
};

export const addProductToCart = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartsService.getCarts(cartId);
        // verificar que el producto exista antes de agregarlo al carrito.
        if (cart) {
            const product = await productsService.getProductById(productId);
            if (product) {
                const result = await cartsService.addProductToCart(cartId, productId);
                res.json({status: "success", message: result});
            } else {
                res.status(400).json({status: "error", message: "No se puede agregar este producto"});
            }
            
        } else{
            res.status(400).json({status: "error", message: "Este carrito no existe"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
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
        console.log(response);
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
        console.log(responde);
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
        res.json({status:"success", result: response, message:"productos eliminados"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};

export const purchaseControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        let approvedProductPurchase = [];
        let rejectedProductPurchase = [];
        let totalAmount = 0
        let cart = await cartsService.getCartById(cartId);
        if (!cart){
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }   
        if(cart.products.length == 0){
            res.status(400).json({status: "error", message: "this cart does not have products"});  
        }else{
            console.log(cart);
       for (let i = 0; i < cart.products.length; i++) {
       
        let productIdCart = cart.products[i]._id;
       
        let productDB = await productsService.getProductById(productIdCart);
        let dif = parseInt(productDB.stock) - cart.products[i].quantity;
        
            if (dif >= 0) {
                
                approvedProductPurchase.push(cart.products[i]);
                totalAmount += cart.products[i].quantity * productDB.price;
                productDB.stock = dif;
                await productsService.updateProducts(cart.products[i]._id, productDB);
                await cartsService.deleteProduct(cartId, cart.products[i]._id);

             }else{
               
                rejectedProductPurchase.push(cart.products[i]);
             };
       };
       console.log("aprobados: ", approvedProductPurchase);

       console.log("rechazados: ", rejectedProductPurchase);

       if (approvedProductPurchase.length > 0 & rejectedProductPurchase.length == 0) {
        const ticket = {
            code: myuuid,
            purchase_daytime: Date(),
            amount: totalAmount,
            purchaser: JSON.parse(JSON.stringify(req.user.email))
        };

        const response = await ticketManager.createTicket(ticket);
        res.json({status:"success", result:response});
        console.log(response);
       };

       if (rejectedProductPurchase.length > 0 & approvedProductPurchase.length == 0) {
        res.json({status:"success",  message: "stock insuficiente de estos productos, no se puede realizar la compra", data: rejectedProductPurchase});
        console.log("stock insuficiente de estos productos, no se puede realizar la compra ", rejectedProductPurchase);
       };


        if (approvedProductPurchase.length > 0 & rejectedProductPurchase.length > 0) {
            const ticket = {
                code: myuuid,
                purchase_daytime: Date(),
                amount: totalAmount,
                purchaser: JSON.parse(JSON.stringify(req.user.email))
            };
            
            const response = await ticketManager.createTicket(ticket);
            res.json({status: "success", result: response, message: "los siguientes productos no se pudieron comprar por falta de stock", data: rejectedProductPurchase});
            console.log(result, " los siguientes productos no se pudieron comprar por falta de stock: ", rejectedProductPurchase);
        };

    };
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};