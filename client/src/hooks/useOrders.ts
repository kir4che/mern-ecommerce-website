import { debounce } from "lodash-es";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useGetOrdersQuery } from "@/store/slices/apiSlice";

interface GetOrdersArgs {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  sortBy?: string;
  orderBy?: "asc" | "desc";
}

export const useOrders = (isAdmin: boolean) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const queryArgs: GetOrdersArgs & { isAdmin: boolean } = {
    page: currentPage,
    limit: 25,
    status: String(filterType),
    keyword: searchKeyword || undefined,
    sortBy,
    orderBy,
    isAdmin,
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch: refreshOrders,
  } = useGetOrdersQuery(queryArgs as Parameters<typeof useGetOrdersQuery>[0]);

  const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);
  const totalPages = useMemo(() => ordersData?.totalPages ?? 1, [ordersData]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchKeyword(value), 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputKeyword(value);
      setCurrentPage(1); // 搜尋時重置回第一頁
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages)
        startTransition(() => {
          setCurrentPage(newPage);
        });
    },
    [totalPages]
  );

  const handleSort = useCallback(
    (key: string) => {
      startTransition(() => {
        setOrderBy((prev) =>
          sortBy === key && prev === "asc" ? "desc" : "asc"
        );
        setSortBy(key);
      });
    },
    [sortBy]
  );

  return {
    orders,
    isLoading,
    isPending,
    error,
    totalPages,
    currentPage,
    filterType,
    sortBy,
    orderBy,
    inputKeyword,
    expandedOrderId,
    setCurrentPage,
    setFilterType,
    setInputKeyword,
    setSearchKeyword,
    setExpandedOrderId,
    handlePageChange,
    handleSort,
    handleSearchChange,
    refreshOrders,
  };
};
