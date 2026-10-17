import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { useCreateReview, useGetReview, useUpdateReview } from '../queries/reviews';
import { userAtom } from '../atoms/user';
import { queryClient } from '../lib/query-client';
import { Button } from '../components/ui/button';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

type FormData = {
  rating: number;
  content: string;
};

export default function ReviewEditPage() {
  const { productId, reviewId } = useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const isCreateMode = !reviewId;

  const { data: review, isLoading, error } = useGetReview(reviewId!, { enabled: !isCreateMode });
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormData>({ defaultValues: { rating: 5, content: '' } });

  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating || 5,
        content: review.content || '',
      });
    }
  }, [review, reset]);

  const handleFormSubmit = (formData: FormData) => {
    if (isCreateMode) {
      // 새 리뷰 작성 시 바로 진행
      onSubmit(formData);
    } else {
      // 수정 시 변경사항이 있을 때만 확인 다이얼로그 표시
      if (isDirty) {
        setPendingFormData(formData);
        setShowConfirmDialog(true);
      } else {
        // 변경사항이 없으면 바로 수정 진행
        onSubmit(formData);
      }
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (isCreateMode) {
      createReview.mutate(
        { productId: productId!, author: user.name, rating: Number(formData.rating), content: formData.content },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            navigate(-1);
          },
        },
      );
    } else {
      updateReview.mutate(
        { ...review!, rating: Number(formData.rating), content: formData.content },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getReview', reviewId] });
            navigate(-1);
          },
        },
      );
    }
  };

  const handleConfirmEdit = () => {
    if (pendingFormData) {
      onSubmit(pendingFormData);
      setShowConfirmDialog(false);
      setPendingFormData(null);
    }
  };

  const handleCancelEdit = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  if (!user.isLogin) {
    navigate('/');
  }

  if (!isCreateMode && isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!isCreateMode && error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
  if (!isCreateMode && !review) return <div className="flex justify-center items-center h-screen">Review not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isCreateMode ? '리뷰 쓰기' : '리뷰 수정'}</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">별점</label>
          <select {...register('rating')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            {...register('content')}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">{isCreateMode ? '등록' : '수정 완료'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showConfirmDialog}
        title="리뷰를 수정할까요?"
        description="변경한 내용으로 리뷰가 수정돼요."
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
