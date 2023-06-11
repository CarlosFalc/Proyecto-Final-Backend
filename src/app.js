import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { connectDB } from "./config/dbConnection.js";
import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { options } from "./config/options.js";
// import session from "express-session";
import { authRouter } from "./routes/auth.routes.js";
// import { ProductManager } from "./dao/managers/Product.Manager.js";
import { ChatMongo } from "./dao/managers/chat.mongo.js";

//const productManager = new ProductManager("products.json");

//configuración del servidor express (http)
const app = express();
const port = 8080;

//midlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

//Conexión a la base de datos
connectDB();

//routes
app.use(viewsRouter);
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/realTimeProducts", viewsRouter);
app.use("/api/sessions", authRouter);

//servidor http
const httpServer = app.listen(port,()=>
console.log(`Server on listening on port ${port}`));

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
io.on("connection", async (socket) => {
	console.log("id: " + socket.client.conn.id);

	const items = await productManager.getProducts();
	socket.emit("itemShow", items);

	socket.on("item", async (product) => {
		await productManager.addProduct(product);
		const items = await productManager.getProducts();
		io.emit("itemShow", items);
	});
});
