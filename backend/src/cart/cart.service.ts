import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
  ) {}

  async getOrCreateCart(cartToken: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { cartToken } });
    if (!cart) {
      cart = this.cartRepo.create({ cartToken });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addItem(
    cartToken: string,
    productId: string,
    quantity = 1,
    unitPrice: number,
  ) {
    const cart = await this.getOrCreateCart(cartToken);

    let item = await this.itemRepo.findOne({
      where: { cartId: cart.id, productId },
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.itemRepo.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice,
      });
    }

    await this.itemRepo.save(item);
    return this.getCartWithItems(cartToken);
  }

  // For loading cart in frontend
  async getCart(cartToken: string) {
    await this.getOrCreateCart(cartToken);
    return this.getCartWithItems(cartToken);
  }


  
  async increaseItemQuantity(itemId: string, delta = 1) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    item.quantity += delta;
    await this.itemRepo.save(item);

    return this.getCartWithItemsById(item.cartId);
  }

 
  async decreaseItemQuantity(itemId: string, delta = 1) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    item.quantity -= delta;

    if (item.quantity <= 0) {
      const cartId = item.cartId;
      await this.itemRepo.remove(item);
      return this.getCartWithItemsById(cartId);
    }

    await this.itemRepo.save(item);
    return this.getCartWithItemsById(item.cartId);
  }

  
  async removeItem(itemId: string) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    const cartId = item.cartId;
    await this.itemRepo.remove(item);
    return this.getCartWithItemsById(cartId);
  }

 

  private async getCartWithItems(cartToken: string) {
    return this.cartRepo.findOne({
      where: { cartToken },
      relations: ['items', 'items.product'],
    });
  }

  private async getCartWithItemsById(cartId: string) {
    return this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }
}
