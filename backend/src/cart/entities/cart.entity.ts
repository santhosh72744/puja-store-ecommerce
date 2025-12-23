import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cartToken: string;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];

  @UpdateDateColumn()
  updatedAt: Date;
}
