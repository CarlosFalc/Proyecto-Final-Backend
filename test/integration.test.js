import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import { userModel } from "../src/dao/models/user.model.js";
import { cartModel } from "../src/dao/models/carts.model.js";

const expect = chai.expect;
const requester = supertest(app);

describe("testing para autenticación", ()=>{

    before(async function () {
        this.userMock = {
            first_name: "Carlos",
            last_name: "Falcon",
            email: "ing.falconc@gmail.com",
            age: 39,
            password: "6wzrc.66"
        };
        this.cookie;
        await userModel.deleteMany({});
    });

    it("El endpoint post api/sessions/register permite registrar un usuario", async function () {
        const response = await requester.post("/api/sessions/signup").send(this.userMock);
        expect(response.statusCode).to.be.equal(200);
    });

    it("El endpoint post api/sessions/login permite loguear un usuario", async function () {
        const response = await requester.post("/api/sessions/login").send({email:this.userMock.email, password:this.userMock.password});
        expect(response.statusCode).to.be.equal(200);
        expect(response.text).to.be.equal("Login exitoso");

    });

});

describe ("testing para carritos", ()=>{

    before(async function () {
        await cartModel.deleteMany({});
    });

    it("El endpoint post api/carts/ agrega un carrito", async function () {
        const response = await requester.post("/api/carts");
        console.log(response._body.cart._id);
        const cartId = JSON.parse(JSON.stringify(response._body.cart._id));
        expect(response.statusCode).to.be.equal(200);
    });

    it("El endpoint get api/carts/:cid muestra el carrito ingresando su id", async function () {
        const response = await requester.post("/api/carts");
        console.log(response._body.cart._id);
        const cartId = JSON.parse(JSON.stringify(response._body.cart._id));
        const result = await requester.get(`/api/carts/${cartId}`);
        console.log(result._body);
        expect(result._body.cart).to.have.property("products");
        expect(Array.isArray(result._body.cart.products)).to.be.equal(true);
    });

});


describe("testing para productos", ()=>{


    it("El endpoint get api/products muestra todos los productos", async function () {
        const response = await requester.get("/api/products?sort=asc");
        expect(response.statusCode).to.be.equal(200);
    });

    it("El endpoint get api/products/:pid mustra el producto ingresando su id", async function () {
        const response = await requester.get("/api/products?sort=asc");
        console.log(response._body.payload[0]._id);
        const productId = JSON.parse(JSON.stringify(response._body.payload[0]._id));
        const result = await requester.get(`/api/products/${productId}`);
        expect(result.statusCode).to.be.equal(200);
        expect(result._body.result).to.have.property("code");
    });
});