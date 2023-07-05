import {Router} from "express";
import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";
import { addCart, getCarts, addProductToCart, updateCart, updateQuantityInCart, deleteProduct, deleteCart } from "../controllers/carts.controller.js";

//services
const router = Router();
const cartsService = new CartsMongo();
const productsService = new ProductsMongo();
//const productsService = new ProductsMongo(ProductsModel);

//Agregar carrito
router.post("/", addCart);

//ruta para listar todos los productos de un carrito
router.get("/:cid", getCarts);

//ruta para agregar productos a un carro por id
router.put("/:cid/:pid", addProductToCart);

// ruta para actualizar todos los productos de un carrito.
router.put("/:cid", updateCart);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", updateQuantityInCart);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", deleteProduct);

//ruta para eliminar un carrito
router.delete("/:cid", deleteCart);

//ruta para agregar un producto al carrito
// router.put("/:cid/product/:pid", async(req,res)=>{
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const cart = await cartsService.getCartById(cartId);
//         // console.log("cart: ", cart);
//         if(cart) {
//             const product = await productsService.getProductById(productId);
//         // console.log("product: ", product);
//             if(product) {
//                 const cartUpdated = await cartsService.addProductToCart(cartId, productId);
//                 res.json({status:"success", result:cartUpdated, message:"Producto Agregado"});
//             } else {
//                 res.status(400).json({status: "error", message: "No se puede agregar este producto"});
//             }
//         } else{
//             res.status(400).json({status: "error", message: "Este carrito no existe"});
//         }
//     } catch (error) {
//         res.status(400).json({status:"error", menssage: error.message});
//     }
// });

export {router as cartsRouter};