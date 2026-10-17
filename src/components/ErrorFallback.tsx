import type { FallbackProps } from 'react-error-boundary';
import { Button } from './ui/button';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-red-500">
      Error: {error instanceof Error ? error.message : '알 수 없는 오류'}
      <Button variant="secondary" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}
