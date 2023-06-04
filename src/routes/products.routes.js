import {Router} from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductMongo.js";

//const productManager = new ProductsFiles();
//const productManager = new ProductManager("products.json");

const productManager = new ProductsMongo();

const router = Router();

router.get("/", async(req,res)=>{
    try {
        const {limit=10,page=1,sort,category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        // console.log("limit: ", limit, "page: ", page, "sortValue: ", sortValue, "category: ", category, "stock: ", stock);
        let query = {};
        if(category && stockValue){
            query = {category: category, stock:stockValue}
        } else {
            if(category || stockValue){
                if(category){
                    query={category:category}
                } else {
                    query={stock:stockValue}
                }
            }
        }
        // console.log("query: ", query)
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        //baseUrl: http://localhost:8080/api/products
        const result = await productManager.getPaginate(query, {
            page,
            limit,
            sort:{price:sortValue},
            lean:true
        });
        // console.log("result: ", result);
        const response = {
            status:"success",
            payload:result.docs,
            totalPages:result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
        }
        console.log("response: ", response);
        res.json(response);
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});


router.get("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const gotProduct = await productManager.getProductById(productId);
        res.json({status: "success", product: gotProduct});
    } catch (error) {
        res.status(400).json({status: "error", message: "No existe producto con este id"});
    }
});

// endpoint para agregar el producto
router.post("/",async(req,res)=>{
    try {
        const {title,description,code,price,status,stock,category} = req.body;
        if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({status:"error", message:"Los campos no son validos"})
        }
        const newProduct = req.body;
        const products = await productManager.getProducts();
        const matchCode = products.some(item=>item.code === code);
        
        if (matchCode) {
            return res.status(400).json({status: "error", message: "Existe otro producto registrado con este código"});
        } else {
                
        const productAdded = await productManager.addProduct(newProduct);
        res.json({status: "success", product: productAdded});
        console.log(productAdded);
        }
    } catch (error) {
        res.status(400).json({status: "error", message: error.message});
    }
});

router.put("/:pid", async(req, res)=>{
    try {
        const productId = req.params.pid;
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "Cada campo debe ser llenado"})
        }
        
        const newData = req.body;   
        const updatedProduct = await productManager.updateProducts(productId, newData);
        res.json({status: "success", message: "Producto actualizado", product: updatedProduct});
        

    } catch (error) {
        res.status(400).json({status: "error", message: "No existe producto con este id"});
    }
});

router.delete("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const productList = await productManager.deleteProducts(productId);
        res.json({status: "success", message: "Producto eliminado", product: productList});

    } catch (error) {
        res.status(400).json({status: "error", message: "No existe producto con este id"});
    }
});

export{router as productRouter};