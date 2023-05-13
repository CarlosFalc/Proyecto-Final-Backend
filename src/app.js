import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { viewRouter } from "./routes/views.routes.js";
import { ProductManager } from "./managers/ProductManager.js";
import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";

const productManager = new ProductManager("products.json");

//configuración del servidor express (http)
const app = express();
const port = 8080;

//midlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

//routes
app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);
app.use(viewRouter);
app.use("/realTimeProducts", viewRouter);

//servidor http
const httpServer = app.listen(port,()=>
console.log(`Server on listening on port ${port}`));

//servidor de websocket
const io = new Server(httpServer);


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
