import {Router} from "express";
import { ProductsFiles } from "../dao/managers/products.files.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
// se importa el modelo de productos
//import { ProductsModel } from "../dao/models/product.model.js";
import { getProducts, getProductById, addProductControl, updateProductControl, deleteProduct } from "../controllers/products.controller.js";
import { checkRoles, checkUserAuthenticated } from "../middlewares/auth.js";
import { uploadImgProduct } from "../utils.js";

//services
const router = Router();

//ruta para obtener los productos
router.get("/", getProducts);

//ruta para obtener los productos por id
router.get("/:pid", getProductById);

//ruta para agregar un producto
router.post("/", checkUserAuthenticated, checkRoles(["admin","premium"]), uploadImgProduct.single("image"), addProductControl);

//ruta para actualizar un producto
router.put("/:pid", checkUserAuthenticated, checkRoles(["admin","premium"]), updateProductControl);

//ruta para eliminar un producto
router.delete("/:pid", checkUserAuthenticated, checkRoles(["admin","premium"]), deleteProduct);

export {router as productsRouter};