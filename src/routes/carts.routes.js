import {Router} from "express";
import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductsModel } from "../dao/models/product.model.js";
import { addCart, getCarts, addProductToCart, updateCart, updateQuantityInCart, deleteProduct, deleteCart, purchaseControl } from "../controllers/carts.controller.js";
import { checkUserAuthenticated, checkRoles } from "../middlewares/auth.js";

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
router.post("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), addProductToCart);

// ruta para actualizar todos los productos de un carrito.
router.put("/:cid", checkUserAuthenticated, checkRoles(["user"]), updateCart);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), updateQuantityInCart);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), deleteProduct);

//ruta para eliminar un carrito
router.delete("/:cid", checkUserAuthenticated, checkRoles(["user"]), deleteCart);

router.get("/:cid/purchase", purchaseControl);

export {router as cartsRouter};