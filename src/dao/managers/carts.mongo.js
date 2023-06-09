//import mongoose from "mongoose";
import { CartModel } from "../models/carts.model.js";
// import { response } from "express";

class CartsMongo{
    constructor(){
        this.model = CartModel;
    };


    async create(){
        const cart = {};
        try {
            const result = await this.model.create(cart);
            return result;
        } catch (error) {
            throw new Error(`Error create cart ${error.message}`);
        }
    };

    async get(cartId){
        try {
            const result = await this.model.findOne({_id:cartId});
            if(!result){
                throw new Error(`No se encontro el carrito ${error.message}`);
            }
            //convertir el formato bson a json
            const data = JSON.parse(JSON.stringify(result));
            return data;
        } catch (error) {
            throw new Error(`Error create cart ${error.message}`);
        }
    };

    async addProduct(cartId,productId){
        try {
            const cart = await this.get(cartId);
            cart.products.push({productId:productId, quantity:1});
            // console.log("cart", cart);
            const result = await this.model.findByIdAndUpdate(cartId,cart,{new:true});
            return result;
        } catch (error) {
            throw new Error(`Error create cart ${error.message}`);
        }
    };

    async addCart(){
        try {
            const cart={
                products: []
            };
            const data = await this.model.create(cart);
            // const response = JSON.parse(JSON.stringify(data));
            return data;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    };

    async getCarts(){
        try {
            const data = await this.model.find();
            const response = JSON.parse(JSON.stringify(data));
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    
    async getCartById(id){
        try {           
            const data = await this.model.findById(id);
            // console.log("data: ", data);
            if(!data){
                // const response = JSON.parse(JSON.stringify(data));
                throw new Error(`El Carrito con ID: ${id} no existe ${error.message}`);
                }
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    
    async deleteProduct(cartId,productId){
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(prod=>prod.id._id===productId);
            if(productIndex>=0){
                const newProducts = cart.products.filter(prod=>prod.id._id!=productId);
                cart.products = [...newProducts];
                const data = await this.model.findByIdAndUpdate(cartId, cart,{new:true});
                return data;
            } else {
                throw new Error(`El producto no existe en el carrito`);
            };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
        
    };
    

    async updateCart(id, cart){
        try {
            const cartUpdated = await this.model.findByIdAndUpdate(id,cart);
            if(cartUpdated){
                return "Carrito actualizado";
            }
            throw new Error(`El carrito no existe`);
        } catch (error) {
            throw new Error(error.message)
        }
    };

    async updateQuantityInCart(cartId, productId,quantity){
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(prod=>prod.id._id==productId);
            if(productIndex>=0){
                cart.products[productIndex].quantity = quantity;
            } else {
                throw new Error("El producto no existe en el carrito");
            };
            const data = await this.model.findByIdAndUpdate(cartId, cart,{new:true});
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    };
}
export {CartsMongo}