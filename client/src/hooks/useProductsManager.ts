import { debounce } from "lodash-es";
import { useCallback, useMemo, useRef, useState } from "react";

import { useAlert } from "@/context/AlertContext";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/store/slices/apiSlice";
import type { CreateProductData, Product } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

type SortField = "title" | "price" | "countInStock" | "createdAt";
type SortOrder = "asc" | "desc";
type SortableValue = string | number;

const initialFormData: Partial<Product> = {
  title: "",
  tagline: "",
  categories: [],
  description: "",
  price: 0,
  content: "",
  expiryDate: "",
  allergens: [],
  delivery: "",
  storage: "",
  ingredients: "",
  nutrition: "",
  countInStock: 0,
  tags: [],
  imageUrl: "",
};

export const useProductsManager = () => {
  const { showAlert } = useAlert();
  const itemsPerPage = 10;

  const originalDataRef = useRef<Partial<Product>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<{ showModal: () => void; close: () => void }>(null);

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    isFetching: productsFetching,
    refetch: refreshProducts,
  } = useGetProductsQuery({ page: 1, limit: 1000 });

  const [addProduct, { isLoading: isAdding }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "in-stock" | "low-stock" | "out-of-stock"
  >("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: "add" | "update" | null;
    productId: string | null;
  }>({ type: null, productId: null });

  // 沒有 selectedProductId 就不會自動發送請求
  const { refetch: refreshProduct, isFetching: isFetchingProduct } =
    useGetProductByIdQuery(selectedProductId ?? "", {
      skip: !selectedProductId,
    });

  const products = useMemo(() => productsData?.products ?? [], [productsData]);

  const categories = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.categories))),
    [products]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchKeyword(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const resetForm = () => {
    setFormData(initialFormData);
    originalDataRef.current = {};
    setFormKey((prev) => prev + 1);
  };

  const filterFormData = (data: Partial<Product>): Partial<Product> => {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== "" && value !== null)
    ) as Partial<Product>;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.tags?.some((t) => t.toLowerCase().includes(keyword))
      );
    }

    if (filterCategory)
      result = result.filter((p) => p.categories.includes(filterCategory));

    if (filterStatus !== "all")
      result = result.filter((p) => {
        if (filterStatus === "in-stock") return p.countInStock >= 30;
        if (filterStatus === "low-stock")
          return 0 < p.countInStock && p.countInStock < 30;
        if (filterStatus === "out-of-stock") return p.countInStock === 0;
        return true;
      });

    result.sort((a, b) => {
      const getSortableValue = (product: Product): SortableValue => {
        if (sortField === "createdAt") {
          const createdAt = (product as Product & { createdAt?: string })
            .createdAt;
          return createdAt ? new Date(createdAt).getTime() : 0;
        }

        return product[sortField];
      };

      let aVal: SortableValue = getSortableValue(a);
      let bVal: SortableValue = getSortableValue(b);

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    products,
    searchKeyword,
    filterCategory,
    filterStatus,
    sortField,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortField(key as SortField);
    setSortOrder(order);
  };

  const handleProduct = async (
    action: "add" | "update" | "delete",
    productData: Partial<Product> & { _id?: string }
  ) => {
    if ((action === "add" || action === "update") && !productData.imageUrl) {
      showAlert({
        variant: "error",
        message: "請上傳商品圖片",
      });
      return false;
    }

    if (action === "add" || action === "update")
      if (!formRef.current?.reportValidity()) return false;

    try {
      if (action === "add") {
        const filteredData = filterFormData(productData);
        await addProduct(filteredData as CreateProductData).unwrap();
      } else if (action === "update") {
        const filteredData = filterFormData(productData);
        const changedData = Object.fromEntries(
          Object.entries(filteredData).filter(
            ([key, value]) =>
              JSON.stringify(value) !==
              JSON.stringify(originalDataRef.current[key])
          )
        );
        if (Object.keys(changedData).length === 0) return false;
        await updateProduct({
          id: productData._id!,
          data: changedData,
        }).unwrap();
      } else if (action === "delete") {
        if (!productData._id) return;
        await deleteProduct(productData._id).unwrap();
      }
      resetForm();
      setExpandedRowId(null);
      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(
          err,
          `${action === "add" ? "新增" : action === "update" ? "更新" : "刪除"}商品失敗，請稍後再試。`
        ),
      });
      return false;
    }
  };

  const handleDeleteSingle = async (
    productId: string,
    productTitle: string
  ) => {
    try {
      await deleteProduct(productId).unwrap();
      await refreshProducts();
      showAlert({
        variant: "success",
        message: `已成功刪除「${productTitle}」`,
      });
      setSelectedProductId(null);
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "刪除商品失敗，請稍後再試。"),
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = confirm(`確定要刪除 ${selectedRows.length} 筆商品嗎？`);
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      await Promise.all(selectedRows.map((id) => deleteProduct(id).unwrap()));
      setSelectedRows([]);
      await refreshProducts();
      showAlert({
        variant: "success",
        message: `已成功刪除 ${selectedRows.length} 筆商品`,
      });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "批量刪除失敗，請稍後再試。"),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    products,
    categories,
    paginatedProducts,
    totalPages,
    currentPage,
    searchInput,
    filterCategory,
    filterStatus,
    sortField,
    sortOrder,
    selectedRows,
    deleteLoading,
    isAdding,
    isUpdating,
    productsLoading,
    productsError,
    productsFetching,
    isFetchingProduct,
    formKey,
    formData,
    modalState,
    expandedRowId,
    modalRef,
    formRef,
    originalDataRef,
    setCurrentPage,
    setFilterCategory,
    setFilterStatus,
    setSelectedRows,
    setFormData,
    setExpandedRowId,
    setModalState,
    setSelectedProductId,
    setFormKey,
    handleSearchChange,
    handleSort,
    handleProduct,
    handleBatchDelete,
    handleDeleteSingle,
    refreshProduct,
    refreshProducts,
    resetForm,
  };
};
