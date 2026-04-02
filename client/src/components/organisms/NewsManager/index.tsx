import { useAlert } from "@/context/AlertContext";
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
} from "@/store/slices/apiSlice";
import type { CreateNewsData, NewsItem } from "@/types";
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
import NewForm from "@/components/organisms/NewsManager/NewsManagerForm";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

interface NewsManagerProps {
  news: NewsItem[];
}

const initialFormData: Partial<NewsItem> = {
  title: "",
  category: "",
  date: new Date(),
  content: "",
  imageUrl: "",
};

type SortField = "title" | "date";
type SortOrder = "asc" | "desc";
type SortableValue = string | number | Date;

const NewsManager = ({ news }: NewsManagerProps) => {
  const { showAlert } = useAlert();

  const originalDataRef = useRef<Partial<NewsItem>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<NewsItem>>(initialFormData);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: "add" | "update" | "delete" | null;
    newsId: string | null;
  }>({ type: null, newsId: null });
  const modalRef = useRef<{ showModal: () => void; close: () => void }>(null);

  const [addNew, { isLoading: isAdding }] = useCreateNewsMutation();
  const [updateNew, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNew, { isLoading: isDeleting }] = useDeleteNewsMutation();

  const { refetch: refreshNew, isFetching: isFetchingNew } =
    useGetNewsByIdQuery(selectedNewsId ?? "", {
      skip: !selectedNewsId,
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

  const filterFormData = (data: Partial<NewsItem>): Partial<NewsItem> => {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== "" && value !== null)
    ) as Partial<NewsItem>;
  };

  const filteredAndSortedNews = useMemo(() => {
    let result = [...news];

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.content.toLowerCase().includes(keyword)
      );
    }

    if (filterCategory)
      result = result.filter((item) => item.category === filterCategory);

    result.sort((a, b) => {
      let aVal: SortableValue = a[sortField];
      let bVal: SortableValue = b[sortField];

      if (sortField === "date") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [news, searchKeyword, filterCategory, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedNews.length / itemsPerPage);
  const paginatedNews = filteredAndSortedNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortField(key as SortField);
    setSortOrder(order);
  };

  const handleNew = async (
    action: "add" | "update" | "delete",
    newData: Partial<NewsItem> & { _id?: string }
  ) => {
    if (action === "add" || action === "update")
      if (!formRef.current?.reportValidity()) return false;

    try {
      if (action === "add") {
        const filteredData = filterFormData(newData);
        await addNew(filteredData as CreateNewsData).unwrap();
      } else if (action === "update") {
        const filteredData = filterFormData(newData);
        const changedData = Object.fromEntries(
          Object.entries(filteredData).filter(
            ([key, value]) =>
              JSON.stringify(value) !==
              JSON.stringify(originalDataRef.current[key as keyof NewsItem])
          )
        );
        if (Object.keys(changedData).length === 0) return false;

        await updateNew({
          id: newData._id!,
          ...changedData,
        }).unwrap();
      } else if (action === "delete") {
        if (!newData._id) return;
        await deleteNew(newData._id).unwrap();
      }
      resetForm();
      setExpandedRowId(null);
      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(
          err,
          `${action === "add" ? "新增" : action === "update" ? "更新" : "刪除"}消息失敗，請稍後再試。`
        ),
      });
      return false;
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = confirm(`確定要刪除 ${selectedRows.length} 筆消息嗎？`);
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      await Promise.all(selectedRows.map((id) => deleteNew(id).unwrap()));
      setSelectedRows([]);
      showAlert({
        variant: "success",
        message: `已刪除 ${selectedRows.length} 筆消息`,
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

  const columns: TableColumn<NewsItem>[] = [
    {
      key: "imageUrl",
      label: "",
      render: (_, row) => (
        <div className="size-12">
          {row.imageUrl ? (
            <BlurImage
              src={row.imageUrl}
              alt={row.title}
              className="size-full object-cover rounded"
            />
          ) : (
            <div className="size-full bg-gray-200 rounded flex-center text-xs text-gray-500">
              無圖
            </div>
          )}
        </div>
      ),
      className: "w-14",
    },
    {
      key: "title",
      label: "標題",
      sortable: true,
      className: "min-w-40 text-sm",
    },
    {
      key: "category",
      label: "分類",
      render: (_, row) => <span>{row.category}</span>,
    },
    {
      key: "date",
      label: "日期",
      sortable: true,
      render: (val) =>
        new Date(val as string | Date).toLocaleDateString("zh-TW"),
      className: "w-24",
    },
  ];

  const expandedContent = (item: NewsItem) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {item.imageUrl && (
        <BlurImage
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <div className="space-y-3 text-sm">
        <p className="font-medium">{item.title}</p>
        <div>
          <span className="font-semibold">分類：</span>
          <span>{item.category}</span>
        </div>
        <div>
          <span className="font-semibold">日期：</span>
          <span>{new Date(item.date).toLocaleDateString("zh-TW")}</span>
        </div>
        <p className="line-clamp-5">{item.content}</p>
      </div>
    </div>
  );

  const categories = useMemo(
    () => [...new Set(news.map((item) => item.category))],
    [news]
  );

  return (
    <div className="space-y-3">
      <ManagerHeader
        title="消息管理"
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onAddClick={() => {
          resetForm();
          setModalState({ type: "add", newsId: null });
          modalRef.current?.showModal();
        }}
      >
        <Select
          name="news-category-filter"
          value={filterCategory ?? ""}
          defaultText="所有分類"
          className="w-full"
          options={categories.map((cat) => ({
            label: cat,
            value: cat,
          }))}
          onChange={(_, value) => {
            setFilterCategory((value as string) || null);
            setCurrentPage(1);
          }}
        />
      </ManagerHeader>
      <ManagerTable
        columns={columns}
        data={paginatedNews}
        selectedRows={selectedRows}
        onSelectRow={(id, checked) => {
          setSelectedRows((prev) =>
            checked ? [...prev, id] : prev.filter((nid) => nid !== id)
          );
        }}
        onSelectAll={(checked) => {
          setSelectedRows(checked ? paginatedNews.map((n) => n._id) : []);
        }}
        onSort={handleSort}
        sortKey={sortField}
        sortOrder={sortOrder}
        expandedRowId={expandedRowId}
        onExpandRow={(id) => setExpandedRowId(expandedRowId === id ? null : id)}
        expandedContent={expandedContent}
        renderRowActions={(item) => (
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={async () => {
                setSelectedNewsId(item._id);
                const res = await refreshNew();
                if (res.data?.newsItem) {
                  setFormData(res.data.newsItem);
                  originalDataRef.current = res.data.newsItem;
                  setFormKey((prev) => prev + 1);
                  setModalState({ type: "update", newsId: item._id });
                  modalRef.current?.showModal();
                }
              }}
              disabled={isFetchingNew}
              className="border-none h-fit"
              aria-label="編輯消息"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => {
                setModalState({ type: "delete", newsId: item._id });
                modalRef.current?.showModal();
              }}
              className="border-none h-fit text-red-600 hover:bg-red-50"
              aria-label="刪除消息"
            />
          </div>
        )}
        emptyMessage="暫無符合條件的消息"
      />
      {totalPages > 1 && (
        <div className="flex items-center text-sm text-gray-600 justify-end gap-2">
          <Button
            variant="icon"
            icon={ArrowLeftIcon}
            iconStyle="size-4"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
          <span>{currentPage}</span>
          <span>/</span>
          <span>{totalPages}</span>
          <Button
            variant="icon"
            icon={ArrowRightIcon}
            iconStyle="size-4"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
      <Modal
        ref={modalRef}
        id="newsModal"
        title={
          modalState.type === "add"
            ? "新增消息"
            : modalState.type === "update"
              ? "編輯消息"
              : "確定要刪除此消息嗎？"
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
          const actionData: Partial<NewsItem> & { _id?: string } =
            modalState.type === "delete"
              ? { _id: modalState.newsId ?? undefined }
              : formData;

          const isSuccess = await handleNew(
            modalState.type || "add",
            actionData
          );
          if (isSuccess) setModalState({ type: null, newsId: null });
          return isSuccess;
        }}
        onClose={() => {
          resetForm();
          setModalState({ type: null, newsId: null });
        }}
        width={modalState.type === "delete" ? "max-w-md" : "max-w-2xl"}
        isShowCloseIcon={modalState.type !== "delete"}
        showAlert
      >
        {modalState.type !== "delete" && (
          <NewForm
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

export default NewsManager;
