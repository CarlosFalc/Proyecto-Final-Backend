import { productsModel } from "../dao/models/product.model.js";
import mongoose from "mongoose";
import { config } from "../config/config.js";

await mongoose.connect(config.mongo.mongoUrl);

const updateProducts = async ()=>{
    try {
        // const products = await productsModel.find();
        // console.log(products);
        const adminId = "64c89e27016715cb8af497aa"; //ID DE ADMIN
        const result = await productsModel.updateMany({},{$set:{owner: adminId}});
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
};

updateProducts();