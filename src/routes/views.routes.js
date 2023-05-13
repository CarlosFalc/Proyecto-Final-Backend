import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager("products.json");

const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
	try {
		const products = await productManager.getProducts();
		res.render("home", { products });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
});

viewRouter.get("/realTimeProducts", (req, res) => {
	try {
		res.render("realTimeProducts");
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
});

export { viewRouter };