import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartQueries, useGetCart, useRemoveCartItem, useUpdateCartItem } from '../queries/cart';
import { checkout } from '../api/cart';
import { useCartSummary } from '../hooks/useCartSummary';
import { queryClient } from '../lib/query-client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: items, isLoading, error } = useGetCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const { totalPrice, isFreeShipping, remainForFreeShipping } = useCartSummary(items);

  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<any>(0);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  useEffect(() => {
    if (coupon) {
      setDiscountedPrice((totalPrice * (1 - coupon.rate)).toFixed(0));
    } else {
      setDiscountedPrice(totalPrice);
    }
  }, [coupon, totalPrice]);

  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const finalPrice = discountedPrice + shippingFee;

  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setCoupon({ code: couponCode, rate: 0.1 });
    } else if (couponCode === 'SAVE20') {
      if (totalPrice < 50000) {
        alert('5만원 이상 구매 시 사용할 수 있어요');
        return;
      }
      setCoupon({ code: couponCode, rate: 0.2 });
    } else {
      alert('유효하지 않은 쿠폰이에요');
    }
  };

  const handleRemove = (productId: string) => {
    setPendingRemoveId(productId);
    setShowRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemoveId) {
      removeCartItem.mutate(pendingRemoveId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: cartQueries.all() });
        },
      });
      setShowRemoveDialog(false);
      setPendingRemoveId(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveDialog(false);
    setPendingRemoveId(null);
  };

  const handleCheckout = async () => {
    try {
      const order = await checkout(finalPrice);
      alert(`주문이 완료되었어요 (주문번호: ${order.id})`);
      navigate('/');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // const handleCheckout = async () => {
  //   await checkout(totalPrice);
  //   navigate('/');
  // };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
  if (items!.length === 0) return <div className="text-center text-gray-500 py-20">장바구니가 비어있어요</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>

      {!isFreeShipping && (
        <div className="bg-blue-50 text-blue-700 text-sm rounded-lg p-3 mb-4">
          {remainForFreeShipping.toLocaleString()}원 더 담으면 무료배송이에요
        </div>
      )}

      <ul className="space-y-3">
        {items!.map((item) => (
          <li key={item.productId} className="bg-white rounded-xl p-3 flex items-center gap-3">
            <img src={item.product.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="text-sm font-medium">{item.product.name}</div>
              <div className="text-sm font-bold">{(item.product.price * item.quantity).toLocaleString()}원</div>
            </div>
            <Input
              type="number"
              className="w-16"
              value={item.quantity}
              onChange={(e) => updateCartItem.mutate({ productId: item.productId, quantity: Number(e.target.value) })}
            />
            <Button variant="ghost" onClick={() => handleRemove(item.productId)}>
              삭제
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-6">
        <Input placeholder="쿠폰 코드" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
        <Button variant="secondary" onClick={applyCoupon}>
          적용
        </Button>
      </div>

      <div className="bg-white rounded-xl p-4 mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-blue-600">
            <span>쿠폰 할인 ({coupon.code})</span>
            <span>-{(totalPrice - discountedPrice).toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>배송비</span>
          <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t">
          <span>결제 금액</span>
          <span>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <Button className="w-full mt-4 py-3" onClick={handleCheckout}>
        {finalPrice.toLocaleString()}원 결제하기
      </Button>

      <ConfirmDialog
        open={showRemoveDialog}
        title="상품을 삭제할까요?"
        description="장바구니에서 상품이 삭제돼요."
        confirmText="삭제"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}
