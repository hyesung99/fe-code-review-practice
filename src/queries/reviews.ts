import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { createReview, getReview, getReviews, updateReview } from '../api/reviews';

export const reviewQueries = {
  all: () => ['reviews'] as const,
  lists: () => [...reviewQueries.all(), 'list'] as const,
  list: (productId: string) =>
    queryOptions({
      queryKey: [...reviewQueries.lists(), productId] as const,
      queryFn: () => getReviews(productId),
    }),
  details: () => [...reviewQueries.all(), 'detail'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...reviewQueries.details(), id] as const,
      queryFn: () => getReview(id),
    }),
};

export function useGetReviews(productId: string) {
  return useQuery(reviewQueries.list(productId));
}

export function useGetReview(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...reviewQueries.detail(id),
    ...options,
  });
}

export function useCreateReview() {
  return useMutation({ mutationFn: createReview });
}

export function useUpdateReview() {
  return useMutation({ mutationFn: updateReview });
}
