import { useAlert } from "@/context/AlertContext";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/slices/apiSlice";
import type { CreateProductData, Product } from "@/types";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { debounce } from "lodash-es";
import { useCallback, useMemo, useRef, useState } from "react";

import BlurImage from "@/components/atoms/BlurImage";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import BatchActionBar from "@/components/molecules/BatchActionBar";
import ManagerHeader from "@/components/molecules/ManagerHeader";
import ManagerTable, { TableColumn } from "@/components/molecules/ManagerTable";
import Modal from "@/components/molecules/Modal";
import ProductForm from "@/components/organisms/ProductsManager/ProductsManagerForm";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

interface ProductsManagerProps {
  products: Product[];
  onNavigateToForm?: (productId?: string) => void;
}

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

type SortField = "title" | "price" | "countInStock" | "createdAt";
type SortOrder = "asc" | "desc";
type SortableValue = string | number;

const ProductsManager = ({ products }: ProductsManagerProps) => {
  const { showAlert } = useAlert();
  const originalDataRef = useRef<Partial<Product>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "in-stock" | "low-stock" | "out-of-stock"
  >("all");

  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: "add" | "update" | "delete" | null;
    productId: string | null;
  }>({ type: null, productId: null });
  const modalRef = useRef<{ showModal: () => void; close: () => void }>(null);

  const [addProduct, { isLoading: isAdding }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const { refetch: refreshProduct, isFetching: isFetchingProduct } =
    useGetProductByIdQuery(selectedProductId ?? "", {
      skip: !selectedProductId,
    });

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

    if (action === "add" || action === "update") {
      if (!formRef.current?.reportValidity()) return false;
    }

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

  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = confirm(`確定要刪除 ${selectedRows.length} 筆商品嗎？`);
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      await Promise.all(selectedRows.map((id) => deleteProduct(id).unwrap()));
      setSelectedRows([]);
      showAlert({
        variant: "success",
        message: `已刪除 ${selectedRows.length} 筆商品`,
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

  const columns: TableColumn<Product>[] = [
    {
      key: "imageUrl",
      label: "",
      render: (_, row) => (
        <div className="w-12 h-12">
          <BlurImage
            src={row.imageUrl}
            alt={row.title}
            className="size-full object-cover rounded"
          />
        </div>
      ),
      className: "w-14",
    },
    {
      key: "title",
      label: "商品名稱",
      sortable: true,
      render: (_, row) => <p>{row.title}</p>,
    },
    {
      key: "categories",
      label: "分類",
      render: (_, row) => (
        <p className="text-xs/5">
          {row.categories.map((cat, index) => (
            <span key={cat}>
              {cat}
              {index < row.categories.length - 1 && "、"}
            </span>
          ))}
        </p>
      ),
    },
    {
      key: "price",
      label: "價格",
      sortable: true,
      render: (val) => `$${val}`,
      className: "text-right",
    },
    {
      key: "countInStock",
      label: "庫存",
      sortable: true,
      render: (_, row) => (
        <span
          className={cn(
            "font-semibold",
            row.countInStock >= 30
              ? "text-green-500"
              : row.countInStock > 0
                ? "text-amber-500"
                : "text-red-500"
          )}
        >
          {row.countInStock}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "salesCount",
      label: "銷量",
      render: (_, row) => row.salesCount ?? 0,
      className: "text-right",
    },
  ];

  const expandedContent = (product: Product) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <BlurImage
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover rounded"
        />
      </div>
      <div className="space-y-3 text-sm">
        <p>{product.description}</p>
        <div>
          <span className="font-semibold">標籤：</span>
          <span className="inline-flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <span key={tag} className="badge badge-primary badge-sm">
                {tag}
              </span>
            ))}
          </span>
        </div>
        <div>
          <span className="font-semibold">過敏原：</span>
          <span>{product.allergens?.join(", ") || "-"}</span>
        </div>
        <div>
          <span className="font-semibold">配送：</span>
          <span>{product.delivery || "-"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <ManagerHeader
        title="商品管理"
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onAddClick={() => {
          resetForm();
          setModalState({ type: "add", productId: null });
          modalRef.current?.showModal();
        }}
      >
        <Select
          name="products-category-filter"
          value={filterCategory ?? ""}
          defaultText="所有商品"
          className="flex-1 min-w-40"
          options={Array.from(
            new Set(products.flatMap((p) => p.categories))
          ).map((cat) => ({
            label: cat,
            value: cat,
          }))}
          onChange={(_, value) => {
            setFilterCategory((value as string) || null);
            setCurrentPage(1);
          }}
        />
        <Select
          name="products-status-filter"
          value={filterStatus}
          className="flex-1 min-w-40"
          options={[
            { label: "所有庫存", value: "all" },
            { label: "充足（≥30）", value: "in-stock" },
            { label: "低庫存（1-29）", value: "low-stock" },
            { label: "缺貨（0）", value: "out-of-stock" },
          ]}
          onChange={(_, value) => {
            setFilterStatus(value as typeof filterStatus);
            setCurrentPage(1);
          }}
        />
      </ManagerHeader>
      <ManagerTable
        columns={columns}
        data={paginatedProducts}
        selectedRows={selectedRows}
        onSelectRow={(id, checked) => {
          setSelectedRows((prev) =>
            checked ? [...prev, id] : prev.filter((pid) => pid !== id)
          );
        }}
        onSelectAll={(checked) => {
          setSelectedRows(checked ? paginatedProducts.map((p) => p._id) : []);
        }}
        onSort={handleSort}
        sortKey={sortField}
        sortOrder={sortOrder}
        expandedRowId={expandedRowId}
        onExpandRow={(id) => setExpandedRowId(expandedRowId === id ? null : id)}
        expandedContent={expandedContent}
        renderRowActions={(product) => (
          <div className="flex items-center gap-px">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={async () => {
                setSelectedProductId(product._id);
                const res = await refreshProduct();
                if (res.data?.product) {
                  setFormData(res.data.product);
                  originalDataRef.current = res.data.product;
                  setFormKey((prev) => prev + 1);
                  setModalState({ type: "update", productId: product._id });
                  modalRef.current?.showModal();
                }
              }}
              disabled={isFetchingProduct}
              className="rounded-full hover:bg-gray-50"
              aria-label="編輯商品"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => {
                setModalState({ type: "delete", productId: product._id });
                modalRef.current?.showModal();
              }}
              className="rounded-full text-red-600 hover:bg-red-50"
              aria-label="刪除商品"
            />
          </div>
        )}
        emptyMessage="暫無符合條件的商品"
      />
      {totalPages > 1 && (
        <div className="flex items-center text-sm text-gray-600 justify-end gap-2">
          <Button
            variant="icon"
            icon={ArrowLeftIcon}
            iconStyle="size-4"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          />
          <span>{currentPage}</span>
          <span>/</span>
          <span>{totalPages}</span>
          <Button
            variant="icon"
            icon={ArrowRightIcon}
            iconStyle="size-4"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </div>
      )}
      <Modal
        ref={modalRef}
        id="productModal"
        title={
          modalState.type === "add"
            ? "新增商品"
            : modalState.type === "update"
              ? "編輯商品"
              : "確定要刪除此商品嗎？"
        }
        confirmText={
          modalState.type === "add"
            ? "新增"
            : modalState.type === "update"
              ? "更新"
              : "刪除"
        }
        isLoading={isAdding || isUpdating || isDeleting}
        onConfirm={async () => {
          const actionData: Partial<Product> & { _id?: string } =
            modalState.type === "delete"
              ? { _id: modalState.productId ?? undefined }
              : formData;
          const isSuccess = await handleProduct(
            modalState.type || "add",
            actionData
          );
          if (isSuccess) setModalState({ type: null, productId: null });
          return isSuccess;
        }}
        onClose={() => {
          resetForm();
          setModalState({ type: null, productId: null });
        }}
        width={modalState.type === "delete" ? "max-w-md" : "max-w-2xl"}
        isShowCloseIcon={modalState.type !== "delete"}
        showAlert
      >
        {modalState.type !== "delete" && (
          <ProductForm
            ref={formRef}
            key={formKey}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </Modal>
      <BatchActionBar
        selectedCount={selectedRows.length}
        onClearSelection={() => setSelectedRows([])}
        onDeleteClick={handleBatchDelete}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default ProductsManager;
