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

export function addToCart(productId: string, quantity: number) {
  return mockRequest(() => {
    const existing = db.cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      db.cart.push({ productId, quantity });
    }
    return true;
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
