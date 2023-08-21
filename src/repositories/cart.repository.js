import { cartModel, cartsDaoMongoose } from '../dao/mongo/cart.dao.mongoose.js'
import { GenericRepository } from './GenericRepository.js'

class CartsRepository extends GenericRepository {
    constructor(dao) { super(dao) }

    async updateCart(cartId, cart) {
        const result = await this.dao.updateCart(cartId, cart)
        return result
    }

    async addProductToCart(cid, pid) {
        const cartIndex = await this.dao.getById(cid)
        const productIndex = cartIndex.products.find((prod) => prod.id == pid)
        
        if (productIndex) {
            productIndex.quantity++
        } else {
            let product = { product: pid, quantity: 1 }
            cartIndex.products.push(product)
        }

        await this.updateCart(cid, cartIndex)
        return cartIndex

    }
    
    async deleteCartProduct(productId, cartId) {
        const result = await this.dao.deleteCartProduct(productId, cartId)
        return result
    }

    async deleteAllProducts(cartId) {
        const result = await this.dao.deleteAllProducts(cartId)
        return result
    }

    async updateProduct(cartId, product, quantity) {
        const result = await this.dao.updateProduct(cartId, product, quantity)
        return result
    }

    async deleteCart(cartId) {
        const result = this.dao.deleteCart(cartId);
        return result
    }
}

export const cartsRepository = new CartsRepository(cartsDaoMongoose)