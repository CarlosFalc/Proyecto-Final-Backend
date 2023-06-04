import { Router } from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductMongo.js";
import { CartsMongo } from "../dao/managers/CartMongo.js";

const productManager = new ProductsMongo();
const cartManager = new CartsMongo();

const router = Router();

router.get("/", async(req,res)=>{
    try {
        const products = await productManager.getProducts();
        
        res.render("home", {products: products});
    } catch (error) {
        res.status(400).json({status: "error", message: error.message});
    }   
});

router.get("/realTimeProducts", async(req, res) => {
    try {
        const products = await productManager.getProducts();
    	res.render("realTimeProducts", {products: products});
    	} catch (error) {
    		res.status(400).json({ status: "error", message: error.message});
    	}
});


router.get("/chat", async(req, res) => {
    try {
        res.render("chat");
        } catch (error) {
            res.status(400).json({status: "error", message: error.message});
        }
});

router.get("/products",async(req,res)=>{
    try {
        const {limit=2,page=1,sort="asc",category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            return res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
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
        console.log("baseUrl", baseUrl);
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
            totalDocs:result.totalDocs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.prevPage}` )}` : null,
            nextLink: result.hasNextPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.nextPage}` )}` : null,
        }
        console.log("response: ", response);
        res.render("products",response);
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
    
});

router.get("/cart/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.render("cartFullInfo", cart);
        console.log(cart);
    } catch (error) {
       
        res.send(`<div>error al cargar esta vista</div>`);
    }
});

export {router as viewsRouter};