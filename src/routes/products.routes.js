import {Router} from "express";
import { ProductsFiles } from "../dao/managers/products.files.js";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
//import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const productsService = new ProductsMongo();
//const productsService = new ProductsFiles();
//const productManager = new ProductManager("products.json");

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
        const result = await productsService.getPaginate(query, {
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

router.post("/",async(req,res)=>{
    try {
        const productCreated = await productsService.create(req.body);
        res.json({status:"success", data:productCreated});
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
})

export{router as productRouter};

// // Obtener todos los productos, incluyendo la limitación ?limit
// router.get("/", async(req,res)=>{
//     try {
//         const products = await productsService.getProducts();
//         const limit = req.query.limit;
//         if(limit){
//             let productsLimited =[];
//             for(let i = 0; i < limit; i++){
//                 productsLimited.push(products[i]);
//             }
//             res.json({status:"success", data:productsLimited});
//         }else{
//             res.json({status:"success", data:products});
//         }
//     } catch (error) {
//         res.status(400).json({status:"error", message:error.message});
//     }
// });

// router.post("/",async(req,res)=>{
//     try {
//         const productCreated = await productsService.createProduct(req.body);
//         res.json({status:"success",data:productCreated});
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).json({status:"error", message:error.message});
//     }
// });

// // http:localhost:8080/api/products/id=1
// router.get("/:pid",async(req,res)=>{
// try {
//     const id = req.params.pid;
//     const product = await productsService.getProductById(id);
//     if(product){
//         res.json({status:"success", data:product});
//         } else {
//         res.status(400).json({status:"error", message:"El producto no existe"});
//         }
// } catch(error){
//     res.status(400).json({status:"error", message:error.message});
// }
// });

// // endpoint para agregar el producto
// router.post("/",async(req,res)=>{
//     try {
//         const {title,description,code,price,status,stock,category} = req.body;
//         if(!title || !description || !code || !price || !status || !stock || !category){
//         return res.status(400).json({status:"error", message:"Los campos no son validos"})
//         }
//         const newProduct = req.body;
//         const productSaved = await productsService.addProduct(newProduct);
//         res.json({status:"success", data:productSaved});
//     } catch (error) {
//         res.status(400).json({status:"error", message:error.message});
//     }
// });


// router.put("/:pid", async(req,res)=>{
//     try {
//     const id = req.params.pid;
//     const productUpdate = req.body;
//     const productIndex = await productsService.updateProduct(id, productUpdate);
//     return (productIndex);
//     } catch(error){
//         res.status(400).json({status:"error", message:error.message});
//     }
// });

// router.delete("/:pid",async(req,res)=>{
//     try {
//     const id = req.params.pid;
//     const productDelete = await productsService.deleteProduct(id);
//     res.json({status:"success", result:productDelete.message});
//     } catch(error){
//         res.status(400).json({status:"error", message:error.message});
//     }
// });
