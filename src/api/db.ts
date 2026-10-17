export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  stock: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Review = {
  id: string;
  productId: string;
  rating: number;
  content: string;
  author: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  totalPrice: number;
};

const product = (id: string, name: string, price: number, category: string, stock: number, description: string): Product => ({
  id,
  name,
  price,
  category,
  stock,
  description,
  imageUrl: `https://picsum.photos/seed/${id}/400/400`,
});

export const db = {
  products: [
    product('p1', '제주 감귤 3kg', 12900, '식품', 20, '산지에서 바로 보내드리는 새콤달콤 감귤이에요.'),
    product('p2', '유기농 그래놀라', 8900, '식품', 35, '아침 대용으로 좋은 유기농 그래놀라예요.'),
    product('p3', '콜드브루 원액 1L', 15900, '식품', 12, '물이나 우유에 타서 바로 마실 수 있어요.'),
    product('p4', '수제 딸기잼', 7500, '식품', 0, '국산 딸기로 만든 수제 잼이에요.'),
    product('p5', '대나무 칫솔 4개입', 9900, '생활', 50, '환경을 생각한 대나무 칫솔이에요.'),
    product('p6', '극세사 수건 5장', 19800, '생활', 18, '흡수력이 좋은 극세사 수건이에요.'),
    product('p7', '디퓨저 200ml', 24000, '생활', 7, '은은한 향이 오래가는 디퓨저예요.'),
    product('p8', '무선 충전기', 29000, '가전', 15, '스마트폰을 올려두기만 하면 충전돼요.'),
    product('p9', '블루투스 스피커', 59000, '가전', 4, '작지만 소리가 풍부한 스피커예요.'),
    product('p10', '미니 가습기', 32000, '가전', 0, '책상 위에 두기 좋은 미니 가습기예요.'),
    product('p11', '오버핏 맨투맨', 39000, '패션', 22, '사계절 입기 좋은 오버핏 맨투맨이에요.'),
    product('p12', '캔버스 토트백', 25000, '패션', 30, '노트북도 들어가는 넉넉한 토트백이에요.'),
    product('p13', '울 양말 3켤레', 12000, '패션', 40, '따뜻하고 부드러운 울 양말이에요.'),
    product('p14', '볼캡', 22000, '패션', 9, '어디에나 잘 어울리는 기본 볼캡이에요.'),
  ] as Product[],
  cart: [
    { productId: 'p1', quantity: 2 },
    { productId: 'p5', quantity: 1 },
  ] as CartItem[],
  reviews: [
    { id: 'r1', productId: 'p1', rating: 5, content: '달고 맛있어요. 또 주문할게요!', author: '김철수' },
    { id: 'r2', productId: 'p1', rating: 4, content: '배송이 빨랐어요.', author: '이영희' },
    { id: 'r3', productId: 'p9', rating: 3, content: '소리는 좋은데 배터리가 아쉬워요.', author: '박민수' },
  ] as Review[],
  orders: [] as Order[],
};
