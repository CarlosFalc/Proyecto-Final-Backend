import {Router} from "express";
import { ProductsMongo } from "../dao/managers/products.mongo.js";
import { ProductsModel } from "../dao/models/product.model.js";
import { CartsMongo } from "../dao/managers/carts.mongo.js";
import { checkUserAuthenticated, checkRoles } from "../middlewares/auth.js";
import { logger } from "../utils/logger.js";
import { resetPassword } from "../controllers/sessions.controller.js";
import { Usermongo } from "../dao/managers/users.mongo.js";
import { UsersDto } from "../dao/dto/users.dto.js";

const productsService = new ProductsMongo();
const cartsService = new CartsMongo();
const userManager = new Usermongo();

const router = Router();


//rutas de las vistas
router.get("/", async(req,res)=>{
    try {
        const products = await productsService.getProducts();
        res.render("home", {products: products});
    }catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

router.get("/register", (req,res)=>{
    res.render("register");
});

router.get("/realtimeproducts", async(req, res)=>{
    try {
        const products = await productsService.getProducts();

        res.render("realTimeProducts", {products: products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }   
});

router.get("/chat", checkUserAuthenticated, checkRoles(["user"]), async(req,res)=>{
    try {
        res.render("chat");
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

router.get("/", (req,res)=>{
    return res.render("cartInfo");
});

router.get("/products",async(req,res)=>{
    try {
        const {limit=2,page=1,sort="asc",category,stock} = req.query;
        if(!["asc","desc"].includes(sort)){
            return res.json({status:"error", message:"ordenamiento no valido, solo puede ser asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        
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
            totalDocs:result.totalDocs,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page:result.page,
            hasPrevPage:result.hasPrevPage,
            hasNextPage:result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.prevPage}` )}` : null,
            nextLink: result.hasNextPage ? `${baseUrl.replace( `page=${result.page}` , `page=${result.nextPage}` )}` : null,
        };
        if(!req.user){
            res.send(`<div> por favor, <a href= "/login">iniciar sesión</a></div>`);         
           }else{
            res.render("products", response);
           }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

router.get("/products/:pid",async(req,res)=>{
    try {
        const productId = req.params.pid;
        const product = await productsService.getProductById(productId);
        // console.log("product: ", product);
        res.render("productInfo", product);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
});

router.get("/cart/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        const result = JSON.parse(JSON.stringify(cart));
        res.render("cart",result);
        logger.http(result);
        } catch (error) {
            res.send(`<div>error al cargar esta vista</div>`);
            }
});

router.get("/login", (req, res)=>{
    if(req.user){
        res.send(`<div> sesión activa, <a href= "/products?page=1">ir a los productos</a></div>`);
    }else{
    res.render("login");
    };
});

router.get("/register", (req, res)=>{
    res.render("register");
});

router.get("/forgot-password", (req, res)=>{
    res.render("forgotPassword");
});

router.get("/reset-password", (req, res)=>{
    const token = req.query.token;
    res.render("resetPass", {token});
});

router.get("/loggerTest", (req, res)=>{
    res.send("testeando logger")
    logger.debug("mensaje debug");
    logger.http("mensaje de tipo http");
    logger.info("mensaje informativo");
    logger.warning("mensaje de advertencia");
    logger.error("mensaje de error");
    logger.fatal("mensaje de error crítico o fatal");
});

router.get("/usersInfo", checkUserAuthenticated, checkRoles(["admin"]), async(req, res)=>{
    try {
        const getUsers = await userManager.getAllUsers();
        const getDtoUsers = getUsers.map(userDB=> new UsersDto(userDB));
             
        res.render("usersInfo", {getDtoUsers: getDtoUsers});
            
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

export {router as viewsRouter};