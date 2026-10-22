import { db } from './db';
import { mockRequest } from './client';

export function getCart() {
  return mockRequest(() =>
    db.cart.map((item) => ({
      ...item,
      product: db.products.find((product) => product.id === item.productId)!,
    })),
  );
}

export type AddToCartErrorCode = 'UNAUTHORIZED' | 'OUT_OF_STOCK';

export type AddToCartResponse = { ok: true } | { ok: false; code: AddToCartErrorCode };

// isLogin은 실제 서버라면 요청에 실려 가는 인증 토큰의 역할
export function addToCart(productId: string, quantity: number, { isLogin }: { isLogin: boolean }) {
  return mockRequest((): AddToCartResponse => {
    if (!isLogin) {
      return { ok: false, code: 'UNAUTHORIZED' };
    }
    const product = db.products.find((product) => product.id === productId);
    if (!product || product.stock === 0) {
      return { ok: false, code: 'OUT_OF_STOCK' };
    }
    const existing = db.cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      db.cart.push({ productId, quantity });
    }
    return { ok: true };
  });
}

export function updateCartItem(productId: string, quantity: number) {
  return mockRequest(() => {
    const item = db.cart.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    return true;
  });
}

export function removeCartItem(productId: string) {
  return mockRequest(() => {
    db.cart = db.cart.filter((item) => item.productId !== productId);
    return true;
  });
}

export function checkout(totalPrice: number) {
  return mockRequest(
    () => {
      const order = { id: `order-${db.orders.length + 1}`, items: [...db.cart], totalPrice };
      db.orders.push(order);
      db.cart = [];
      return order;
    },
    { failRate: 0.1 },
  );
}
