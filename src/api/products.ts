import { db } from './db';
import { mockRequest } from './client';

export type GetProductsParams = {
  page: number;
  size: number;
  keyword: string;
  category?: string;
};

export function getProducts({ page, size, keyword, category }: GetProductsParams) {
  return mockRequest(() => {
    const filtered = db.products.filter(
      (product) => product.name.includes(keyword) && (!category || product.category === category),
    );

    return {
      items: filtered.slice((page - 1) * size, page * size),
      totalCount: filtered.length,
    };
  });
}

export function getProduct(id: string) {
  return mockRequest(() => {
    const product = db.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('상품을 찾을 수 없어요');
    }
    return product;
  });
}

export function getRelatedProducts(category: string) {
  return mockRequest(() => db.products.filter((product) => product.category === category).slice(0, 4));
}
