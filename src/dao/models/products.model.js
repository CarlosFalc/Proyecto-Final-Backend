import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title:{ type: String, required:true},
    description: {type:String, required:true},
    code: {type:Number,required:true, unique:true},
    price: {type:Number, required:true},    
    status: {type:Boolean, default:true},
    stock: {type:Number, required:true},
    category: {
        type:String,
        required:true,
        enum: ["Muebles","Baño y Cocina","Parrillas"],},
    thumbnail: {type:String, required:true}    
});

export const productsModel = mongoose.model(productsCollection,productsSchema);