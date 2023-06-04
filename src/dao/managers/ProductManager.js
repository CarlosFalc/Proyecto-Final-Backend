import fs from "fs";
import path from "path";
import {__dirname} from "../../utils.js";
import {options} from "../../config/options.js";


class ProductManager{
    constructor(){
        this.path = path.join(__dirname,`/dao/files/${options.filesystem.products}`)
    }

    fileExists() {
		return fs.existsSync(this.path);
	}

    generateId(products) {
		let newId;
		if (!products.length) {
			newId = 1;
		} else {
			newId = products[products.length - 1].id + 1;
		}
		return newId;
	}

	async codeDuplicate(code) {
		const content = await fs.promises.readFile(this.path, "utf-8");
		const products = JSON.parse(content);
		for (const i = 0; i < products.length; i++) {
			if (products[i].code === code) {
				return true;
			}
		}
		return false;
	}

    async addProduct(product) {
		try {
			if (await this.codeDuplicate(product.code)) {
				throw new Error("Codigo ingresado ya se encuentra registrado");
			}

			if (this.fileExists()) {
				const content = await fs.promises.readFile(this.path, "utf-8");
				const products = JSON.parse(content);
				const productId = this.generateId(products);
				product.id = productId;
				products.push(product);
				await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
				return product;
			} else {
				const productId = this.generateId([]);
				product.id = productId;
				await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2));
				return product;
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

    async getProducts(){
		try {
			if (this.fileExists()) {
				const content = await fs.promises.readFile(this.path, "utf-8");
				const products = JSON.parse(content);
				const arrayProducts = Object.values(products);
				return arrayProducts;
			} else {
				return "El archivo no existe";
			}
		} catch (error) {
			throw new error(error.message);
		}
	};

    async getProductById(id) {
		try {
			if (this.fileExists()) {
				const content = await fs.promises.readFile(this.path, "utf-8");
				const products = JSON.parse(content);
				const product = products.find((item) => item.id === parseInt(id));
				if (product) {
					return product;
				} else {
					throw new Error(`El producto con el id ${id} no existe`);
				}
			} else {
				throw new Error("El archivo no existe");
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

    async updateProduct(id, product) {
		try {
			if (this.fileExists()) {
				const content = await fs.promises.readFile(this.path, "utf-8");
				const products = JSON.parse(content);
				const productIndex = products.findIndex((item) => item.id === parseInt(id));
				if (productIndex >= 0) {
					products[productIndex] = {
						...products[productIndex],
						...product
					};
					await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
					return `El producto con el id ${id} fue modificado y actualizado`;
				} else {
					throw new Error(`El producto con el id ${id} no existe`);
				}
			} else {
				throw new Error("El archivo no existe");
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

    async deconsteProduct(id) {
		try {
			if (this.fileExists()) {
				const content = await fs.promises.readFile(this.path, "utf-8");
				const products = JSON.parse(content);
				const productIndex = products.findIndex((item) => item.id === id);
				if (productIndex >= 0) {
					products.splice(productIndex);
				}
				await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
				return `El elemento con ID ${id} ha sido eliminado del archivo ${this.path}.`;
			} else {
				throw new Error("El archivo no existe");
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};
}
export {ProductManager};