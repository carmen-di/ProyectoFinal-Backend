import { ProductManager } from "./ProductManager.js"
import { fileManager } from '../fileSystem/fileManager.js'
import { cartModel } from "../mongo/cart.dao.mongoose.js"

export class Cart {
    constructor({ id, products }) {
        this.id = id
        this.products = products
    }
}

export class CartManager extends fileManager {

    path

    constructor(path) {
        this.path = path;
        this.carts;
        this.products = [];
    }

    async save(cart) {
        await this.read()
        this.carts.push(cart)
        await this.write()
        return cart
    }

    async getCarts() {
        await this.read()
        return this.carts
    }
    
    async getCartById(id) {
        const cart = await this.getCarts()
        const cartFind = cart.find((carts) => carts.id === id)
        if (!cartFind) {
            console.log("Not found")
        } else {
            return cartFind
        }
    }
    
    async addProductToCart(cid, pid) {
        try {
            const pm = new ProductManager('./products.json');

            const productos = await pm.getProducts()
            const prodIndex = productos.findIndex(prod => prod.id == pid)
            const prodFil = productos[prodIndex]

            const car = await this.getCarts()
            const carIndex = car.findIndex(carrito => carrito.id == cid)
            const carFil = carritos[carIndex]

            let cant = 1
            const produID = {
                "id": `${prodFil.id}`,
                "quantity": `${cant}`
            };

            const idInCar = [];
            const carritoProds = carFil.products
            carritoProds.forEach(element => {
                idInCar.push(element.id)
            });

            if (idInCar.includes(pid)) {
                const prodInCarrito = carritoProds.find(element => element.id == pid)
                prodInCarrito.quantity++;
                carFil.quantity++;
                await this.write()
            } else {
                const push = carritoProds.push(produID)
                carFil.quantity++;
                this.carts[carIndex].products = carritoProds
                await this.write()
            }
            await this.write()
            return { "message": "producto cargado correctamente"  }
        } catch (error) {
            return error.message
        }
    
    }

    async deleteCartProduct(cid, pid) {
        const cart = await this.getCartById(cid);
        const product = cart.products
        const cartEliminar = product.findIndex(prod => prod.id === pid);
        if (cartEliminar === -1) {
            console.log("Not found")
        } 
        const [eliminar] = product.splice(cartEliminar, 1)
        await this.write()
        return eliminar
    }
    
    async updateCart(cid, updcart) {
        const cart = await this.getCartById(cid);
        const prodIndex = cart.products.findIndex(prod => prod.id === pid);
        cart.products[prodIndex].quantity = newQuantity;
        await this.write();
    }
    
    async updProductInCart(cid, pid, upCantidad) {
        const cart = await this.getCartById(cid);
        const products = cart.products;
        const productToUpdate = products.find((p) => p.product === pid);
        if (!productToUpdate) {
            throw new Error("Product not found in cart");
        }
        const newQuantity = parseInt(upCantidad.quantity, 10);
        if (isNaN(newQuantity) || newQuantity < 0) {
            throw new Error("Invalid quantity");
        }
        productToUpdate.quantity = newQuantity;
        await cartModel.findByIdAndUpdate(cart._id, { products: products });
    }

    async delAllProductsInCart(cid) {
        const cart = await this.getCartById(cid);
        cart.products = [];
        await this.write(); 
        return cart;
    }
    
    async deleteCart(cid) {
        const cart = await this.getCartById(cid);
        await cartModel.findByIdAndRemove(cart._id);
    }
}