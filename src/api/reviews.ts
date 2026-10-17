import { db, type Review } from './db';
import { mockRequest } from './client';

export function getReviews(productId: string) {
  return mockRequest(() => db.reviews.filter((review) => review.productId === productId));
}

export function getReview(id: string) {
  return mockRequest(() => {
    const review = db.reviews.find((review) => review.id === id);
    if (!review) {
      throw new Error('리뷰를 찾을 수 없어요');
    }
    return review;
  });
}

export function createReview(input: Omit<Review, 'id'>) {
  return mockRequest(() => {
    const review = { ...input, id: `r${Date.now()}` };
    db.reviews.push(review);
    return review;
  });
}

export function updateReview(input: Review) {
  return mockRequest(() => {
    const index = db.reviews.findIndex((review) => review.id === input.id);
    db.reviews[index] = input;
    return input;
  });
}
