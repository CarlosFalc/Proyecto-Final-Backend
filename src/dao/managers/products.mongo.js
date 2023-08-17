import { ProductsModel } from "../models/product.model.js";

class ProductsMongo{
    constructor(){
        this.model = ProductsModel;
    }

    async getPaginate(query={}, options={}){
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener productos ${error.message}`);
        }
    };

    async addProduct(product){
        try {
            const data = await this.model.create(product);
            return data
        } catch (error) {
            throw new Error(`Error al crear el producto ${error.message}`);
        }
    };

    async getProducts(){
        try {
            const data = await this.model.find().lean();
            // const response = JSON.parse(JSON.stringify(data));
            return data;
        } catch (error) {
            throw new Error(`Error al obtener productos ${error.message}`);
        }
    };

    async getProductById(id){
        try {
            const data = await this.model.findById(id);
            if(!data){
                throw new Error(`El producto con id: ${id} no existe`)
            }
            return data;
        } catch (error) {
            throw new Error(`Error al obtener producto ${error.message}`);
        }
    };
    
    async updateProduct(id,product){
        try {
            const data = await this.model.findByIdAndUpdate(id,product,{new:true});
            if(!data){
                throw new Error(`El producto con id: ${id} no existe`);
            }
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el producto ${error.message}`);
        }
    };

    async deleteProduct(id){
        try {
            await this.model.findByIdAndDelete(id);
            return {message: `EL producto con el id: ${id} fué eliminado`};
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    };
}
export {ProductsMongo};