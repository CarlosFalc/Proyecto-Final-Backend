import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { viewsRouter } from "./routes/views.routes.js";
import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";

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
app.use(viewsRouter);
app.use("/realtimeproducts", viewsRouter);

//servidor http
const httpServer = app.listen(port,()=>console.log(`Server on listening on port ${port}`));

//servidor de websocket
const socketServer = new Server(httpServer);

//configuración del motor de plantillas
app.engine("handlebars",handlebars.engine());
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","handlebars");

//función principal del servidor websocket
socketServer.on("connection",(socket)=>{
    console.log(`nuevo socket cliente conectado ${socket.id}`)
    socket.emit("message.Server","Conectado exitosamente");
    socket.on("messageClient",(data)=>{
        console.log("mensaje desde el cliente", data)
    });
});