import { useMutation, useQuery } from '@tanstack/react-query';
import { createReview, getReview, getReviews, updateReview } from '../api/reviews';

export function useGetReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews(productId),
  });
}

export function useGetReview(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['getReview', id],
    queryFn: () => getReview(id),
    ...options,
  });
}

export function useCreateReview() {
  return useMutation({ mutationFn: createReview });
}

export function useUpdateReview() {
  return useMutation({ mutationFn: updateReview });
}
