import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { CustomError } from "../services/errors/customError.service.js";
import { generateProductErrorParams } from "../services/productErrorParams.service.js";
import { EError } from "../enums/Eerror.js";
import { logger } from "../utils/logger.js";
import { Usermongo } from "../dao/managers/users.mongo.js";
import { deletedProductEmail } from "../utils/message.js";

//services
const productsService = new ProductsMongo();
const userManager = new Usermongo();

export const getProducts = async(req,res)=>{
    try {
        const {limit=10,page=1,sort,category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            res.status(400).json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"});
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        let query = {};
        if(category && stock){
            query = {category: category, stock: stockValue}
        } else {
            if(category || stockValue){
                if(category){
                    query={category:category}
                } else {
                    query={stock:stockValue}
                }
            }
        }
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        const result = await productsService.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
        
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({status:"error", message: error.message});
    }
};

export const addProductControl = async (req, res)=>{
    try {
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            CustomError.createError({
                name: "Error al crear el producto",
                cause: generateProductErrorParams(),
                message: "Error en la creación del producto",
                errorCode: EError.INVALID_JSON
            });
            
        }
    
        const newProduct = req.body;
        const products = await productsService.getProducts();
        const matchCode = products.some(element=>element.code === code);

        if (matchCode) {
            return res.status(400).json({status: "error", message: "Producto existente con este código"});
        } else {

            newProduct.owner = req.user._id;
        if (req.file) {
            newProduct.image = req.file.filename;  
        };
                
        const productAdded = await productsService.addProduct(newProduct);
        res.json({status: "success", product: productAdded});
        logger.http(productAdded);
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
        logger.error("mensaje de error");
    }
};

export const getProductById = async(req,res)=>{
    try {
        const productId = req.params.pid;
        const gproduct = await productsService.getProductById(productId);
        res.json({status:"success", product: gproduct});
        logger.http(gproduct);
    } catch (error) {
        res.status(400).json({status: "error", message: "No hay producto con este id"});
        logger.error("mensaje de error");
    }
};

export const updateProductControl = async(req, res)=>{
    try {
        const productId = req.params.pid;
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "Cada campo debe ser llenado"})
        }
        
        const newData = req.body;   
        const product = await productsService.getProductById(productId);
        if(req.user.role === "premium" && JSON.stringify(product.owner) == JSON.stringify(req.user._id) || req.user.role === "admin"){
        const updatedProduct = await productManager.updateProducts(productId, newData);
        res.json({status: "success", message: "producto modificado", product: updatedProduct});
        logger.http(updatedProduct);
        } else{
            res.status(400).json({status: "error", message: "no tienes permiso para actualizar este producto"});
        }    
    } catch (error) {
        res.status(400).json({status: "error", message: "No hay producto con este id"});
        logger.error("mensaje de error");
    }
};

export const deleteProduct = async(req,res)=>{
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);
        if(req.user.role === "premium" && JSON.stringify(product.owner) == JSON.stringify(req.user._id) || req.user.role === "admin"){
        //luego eliminamos el producto
        const productList = await productsService.deleteProduct(productId);
        const ownerProduct = await userManager.getUserById(product.owner);
        if (ownerProduct.role === "premium") {
            deletedProductEmail(ownerProduct.email);
        }
        res.json({status: "success", message: "product deleted", product: productList});
        logger.http(productList);
        } else{
            res.status(400).json({status: "error", message: "no tienes permiso para eliminar este producto"});
        }
    } catch (error) {
        res.status(400).json({status: "error", message: "No existe producto con este id"});
        logger.error("mensaje de error");
    }
};