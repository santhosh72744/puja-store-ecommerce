// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  create(data: CreateProductDto) {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  findAll(category?: string) {
    if (category) {
      return this.repo.find({
        where: { category },
        order: { name: 'ASC' },
      });
    }

    return this.repo.find({ order: { name: 'ASC' } });
  }


  async findOne(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }


  async findOneBySlug(slug: string) {
    const product = await this.repo.findOne({ where: { slug } });
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    return { deleted: true };
  }
}
