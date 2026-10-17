import { Link } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { cartCountAtom } from '../atoms/cart';
import { userAtom } from '../atoms/user';

export function Header() {
  const cartCount = useAtomValue(cartCountAtom);
  const [user, setUser] = useAtom(userAtom);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          연습 마켓
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/cart" className="relative">
            장바구니
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-blue-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="text-gray-500" onClick={() => setUser({ ...user, isLogin: !user.isLogin })}>
            {user.isLogin ? `${user.name}님 · 로그아웃` : '로그인'}
          </button>
        </div>
      </div>
    </header>
  );
}
