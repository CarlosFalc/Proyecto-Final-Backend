import {Router} from "express";
import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { cartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";
import { addCart, getCartById, addProductToCart, updateCart, updateQuantityInCart, deleteProduct, deleteCart, purchaseControl } from "../controllers/carts.controller.js";
import { checkUserAuthenticated, checkRoles } from "../middlewares/auth.js";

//services
const router = Router();
//const cartsService = new CartsMongo();
//const productsService = new ProductsMongo();
//const productsService = new ProductsMongo(ProductsModel);

//Agregar carrito
router.post("/", addCart);

//ruta para listar todos los productos de un carrito
router.get("/:cid", getCartById);

//ruta para agregar productos a un carro por id
router.post("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user","premium"]), addProductToCart);

// ruta para actualizar todos los productos de un carrito
router.put("/:cid", checkUserAuthenticated, checkRoles(["user","premium"]), updateCart);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user","premium"]), updateQuantityInCart);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user","premium"]), deleteProduct);

//ruta para eliminar un carrito
router.delete("/:cid", checkUserAuthenticated, checkRoles(["user","premium"]), deleteCart);

router.get("/:cid/purchase", purchaseControl);

export {router as cartsRouter};