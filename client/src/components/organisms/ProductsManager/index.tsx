import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";

import BlurImage from "@/components/atoms/BlurImage";
import Select from "@/components/atoms/Select";
import BatchActionBar from "@/components/molecules/BatchActionBar";
import ManagerHeader from "@/components/molecules/ManagerHeader";
import ManagerTable, { TableColumn } from "@/components/molecules/ManagerTable";
import Modal from "@/components/molecules/Modal";
import ProductForm from "@/components/organisms/ProductsManager/ProductsManagerForm";
import { useProductsManager } from "@/hooks/useProductsManager";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

const ProductsManager = () => {
  const { open: openConfirmDialog } = useConfirmDialog();
  const {
    products,
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
  } = useProductsManager();

  const columns: TableColumn<Product>[] = [
    {
      key: "imageUrl",
      label: "",
      render: (_, row) => (
        <div className="size-12">
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

  if (productsLoading) return <Loading />;

  if (productsError)
    return (
      <div className="flex-center h-48 flex-col gap-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base text-gray-600">
          {getErrorMessage(productsError, "抱歉，暫時無法取得商品資訊。")}
        </p>
        <Button
          onClick={refreshProducts}
          icon={RefreshIcon}
          className="flex h-10 items-center gap-x-2"
          disabled={productsFetching}
        >
          {productsFetching ? "載入中" : "重新載入"}
        </Button>
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
                openConfirmDialog({
                  title: "刪除商品",
                  message: `確定要刪除「${product.title}」嗎？`,
                  confirmText: "刪除",
                  cancelText: "取消",
                  onConfirm: () =>
                    handleDeleteSingle(product._id, product.title),
                });
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
        title={modalState.type === "add" ? "新增商品" : "編輯商品"}
        confirmText={modalState.type === "add" ? "新增" : "更新"}
        isLoading={isAdding || isUpdating}
        onConfirm={async () => {
          const isSuccess = await handleProduct(
            modalState.type || "add",
            formData
          );
          if (isSuccess) setModalState({ type: null, productId: null });
          return isSuccess;
        }}
        onClose={() => {
          resetForm();
          setModalState({ type: null, productId: null });
        }}
        width="max-w-2xl"
      >
        <ProductForm
          ref={formRef}
          key={formKey}
          formData={formData}
          setFormData={setFormData}
        />
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
