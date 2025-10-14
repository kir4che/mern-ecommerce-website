import { useMemo } from "react";

import Button from "@/components/atoms/Button";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

interface PaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  handlePageChange,
}) => {
  // 使用 useMemo 計算頁碼，避免不必要的重渲染。
  const pageNumbers = useMemo(() => {
    const pages = [];
    // 如果總頁數小於等於 5，顯示所有頁碼。
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 顯示最後的頁數
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-center gap-4 py-12">
      {page !== 1 && (
        <Button
          variant="icon"
          icon={ArrowLeftIcon}
          onClick={() => handlePageChange(page - 1)}
          className="border-none h-fit hover:opacity-50"
          data-testid="previous-button"
        />
      )}
      <ul className="flex items-center justify-center space-x-2">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <li key={index}>
                <span className="flex items-center justify-center w-8 h-8 text-sm">
                  ...
                </span>
              </li>
            );
          }
          return (
            <li key={pageNum}>
              <Button
                onClick={() => handlePageChange(pageNum)}
                className={`h-8 w-8 p-0 text-sm border-none rounded-full ${
                  page === pageNum ? "bg-primary text-secondary" : "bg-white"
                } ${page !== pageNum ? "hover:bg-primary/10 hover:text-primary" : ""}`}
              >
                {pageNum}
              </Button>
            </li>
          );
        })}
      </ul>
      {page !== totalPages && (
        <Button
          variant="icon"
          icon={ArrowRightIcon}
          onClick={() => handlePageChange(page + 1)}
          className="border-none h-fit hover:opacity-50"
          data-testid="next-button"
        />
      )}
    </div>
  );
};

export default Pagination;
