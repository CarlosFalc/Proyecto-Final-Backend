import {Router} from "express";
// import { ProductsFiles } from "../dao/managers/products.files.js";
// import { ProductsMongo } from "../dao/managers/products.mongo.js";
// se importa el modelo de productos
//import { ProductsModel } from "../dao/models/product.model.js";
import { getProducts, createProduct, getProductById, deleteProduct } from "../controllers/products.controller.js";

//services
const router = Router();
//const productsService = new ProductsMongo();

//ruta para obtener los productos
router.get("/", getProducts);

//ruta para agregar un producto
router.post("/", createProduct);

//ruta para obtener los productos por id
router.get("/:pid", getProductById);

//ruta para eliminar un producto
router.delete("/:pid", deleteProduct);

export {router as productsRouter};