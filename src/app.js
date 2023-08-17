import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { __dirname } from "./utils.js";
import { connectDB } from "./config/dbConnection.js";
import { viewsRouter } from "./routes/views.routes.js";
//import { sessionsRouter } from "./routes/sessions.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
//import { options } from "./config/options.js";
import { authRouter } from "./routes/auth.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { ProductsFiles } from "./dao/managers/products.files.js";
import { ChatMongo } from "./dao/managers/chat.mongo.js";
import { config } from "./config/config.js";
import { mockRouter } from "./routes/mock.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";
import { swaggerSpecs } from "./config/swaggerConfig.js";
import swaggerUI from "swagger-ui-express";

const productsFiles = new ProductsFiles("products.json");

//configuración del servidor express (http)
const app = express();
const port = config.server.port;

//midlewares
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));


//Conexión a la base de datos
connectDB();

//Configuración de session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.mongoUrl
    }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}));

//Configuración de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(viewsRouter);
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/realTimeProducts", viewsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/mockingproducts", mockRouter);
app.use("/api/users", usersRouter);
app.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//servidor http
const httpServer = app.listen(port,()=>
logger.info(`Server on listening on port ${port}`));

//servidor de websocket
const io = new Server(httpServer);

//Configuración del chat
const chatService = new ChatMongo();
io.on("connection",async(socket)=>{
	const messages = await chatService.getMessages();
	socket.broadcast.emit("msgHistory", messages);

	//Recibir el mensaje del cliente
	socket.on("message",async(data)=>{
		await chatService.addMessage(data);
		const messages = await chatService.getMessages();
		io.emit("msgHistory", messages);
	});
});

//configuración del motor de plantillas
app.engine("handlebars",handlebars.engine());
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","handlebars");

//función principal del servidor websocket
io.on("connection", async(socket)=>{
    try {
        logger.info(`nuevo socket cliente conectado ${socket.id}`)
    const totalProducts = await productsFiles.getProducts();
    socketServer.emit("totalProductsMessage", totalProducts);

    socket.on("newProduct", async(data)=>{
        try {
            logger.http("newProduct", data);
            const addedProduct = await productsFiles.addProduct(data);
            
            socketServer.emit("newProductMessage", addedProduct);
        } catch (error) {
            throw new error (error.message);
        }
       
    });
    } catch (error) {
        throw new error (error.message);
    }

    socket.on("deleteOrder", async(data)=>{
        try {
            await productsFiles.deleteProduct(data);
        } catch (error) {
            throw new error (error.message); 
        }        
    })
});


// io.on("connection", async (socket) => {
// 	console.log("id: " + socket.client.conn.id);

// 	const items = await productsService.getProducts();
// 	socket.emit("itemShow", items);

// 	socket.on("item", async (product) => {
// 		await productsService.addProduct(product);
// 		const items = await productsService.getProducts();
// 		io.emit("itemShow", items);
// 	});
// });
