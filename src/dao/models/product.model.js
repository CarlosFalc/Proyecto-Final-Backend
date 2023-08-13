import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title:{ type: String, required:true},
    description: {type: String, required:true},
    code: {type: Number, required:true, unique:true},
    price: {type: Number, required:true},    
    status: {type: Boolean, default:true},
    stock: {type: String, required:true},
    category: {type: String, required:true},
    thumbnail: {type:String, required:true},
    owner:{type: mongoose.Schema.Types.ObjectId, ref:"users"}
});

productSchema.plugin(mongoosePaginate);

export const ProductsModel = mongoose.model(productCollection,productSchema);