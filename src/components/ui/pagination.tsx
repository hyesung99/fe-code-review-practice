import { Button } from "./button";

type PaginationProps = {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  totalPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex justify-center gap-1 mt-6">
      {Array.from({ length: totalPage }).map((_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "primary" : "ghost"}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
};
