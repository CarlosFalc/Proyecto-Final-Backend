import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title:{ type: String, required:true},
    description: {type: String, required:true},
    code: {type: Number, required:true, unique:true},
    price: {type: Number, required:true},    
    status: {type: Boolean, default:true},
    stock: {type: String, required:true},
    category: {
        type: String,
        required:true,
        enum: ["Muebles","Baño y Cocina","Parrillas"],},
    thumbnail: {type:String, required:true}    
});
productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection,productsSchema);