import { Suspense, useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { TodayProduct } from "../components/TodayProduct";
import { Chip } from "../components/ui/chip";
import { Input } from "../components/ui/input";
import { ErrorFallback } from "../components/ErrorFallback";
import { LoadingFallback } from "../components/LoadingFallback";
const categories = ["전체", "식품", "생활", "가전", "패션"];

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">오늘의 상품</h1>

      <Input
        placeholder="상품명을 검색하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="mb-3"
      />

      <Chip.Group value={category} onValueChange={setCategory}>
        {categories.map((category) => (
          <Chip.Item key={category} value={category}>
            {category}
          </Chip.Item>
        ))}
      </Chip.Group>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <TodayProduct
                key={category}
                keyword={keyword}
                category={category}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
