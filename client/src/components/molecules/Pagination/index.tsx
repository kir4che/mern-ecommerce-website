import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { useMemo } from "react";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

interface PaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  handlePageChange,
}: PaginationProps) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const siblingCount = 1;

    pages.push(1);

    const start = Math.max(2, page - siblingCount);
    const end = Math.min(totalPages - 1, page + siblingCount);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="分頁導航" className="flex-center gap-2 pt-8 pb-2">
      <Button
        variant="icon"
        icon={ArrowLeftIcon}
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "rounded-full size-8",
          page === 1 ? "opacity-25 cursor-not-allowed" : "hover:bg-primary/5"
        )}
        aria-label="返回上一頁"
      />
      <ul className="flex items-center gap-1 md:gap-2">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...")
            return (
              <li key={`ellipsis-${index}`} className="px-1">
                <span className="text-gray-500 select-none">...</span>
              </li>
            );
          const isActive = page === pageNum;

          return (
            <li key={pageNum}>
              <Button
                variant={isActive ? "primary" : "icon"}
                onClick={() => handlePageChange(pageNum as number)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`前往第 ${pageNum} 頁`}
                className={cn(
                  "size-8 text-sm font-medium transition-all rounded-full",
                  isActive ? "shadow" : "hover:text-primary hover:bg-primary/5"
                )}
              >
                {pageNum}
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="icon"
        icon={ArrowRightIcon}
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(
          "rounded-full size-8",
          page === totalPages
            ? "opacity-25 cursor-not-allowed"
            : "hover:bg-primary/5"
        )}
        aria-label="前往下一頁"
      />
    </nav>
  );
};

export default Pagination;
