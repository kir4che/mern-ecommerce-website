import { useState, useRef } from "react";

import type { NewsItem } from "@/types/news";
import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";

import NewForm from "@/components/organisms/NewsManager/Form";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";

import { ReactComponent as EditIcon } from "@/assets/icons/edit.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";

interface NewsManagerProps {
  news: NewsItem[];
  refreshNews: () => void;
}

const initialFormData: Partial<NewsItem> = {
  title: "",
  category: "",
  date: new Date(),
  content: "",
  imageUrl: "",
};

const NewsManager: React.FC<NewsManagerProps> = ({ news, refreshNews }) => {
  const { showAlert } = useAlert();

  const [formKey, setFormKey] = useState(0);
  const [formData, setFormData] = useState<Partial<NewsItem>>(initialFormData);
  const originalDataRef = useRef<Partial<NewsItem>>({});

  // 重置表單
  const resetForm = () => {
    setFormData(initialFormData);
    setFormKey((prev) => prev + 1);
  };

  // 過濾表單資料，移除空的欄位。
  const filterFormData = (data: Partial<NewsItem>) => {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null,
      ),
    );
  };

  const addNew = useAxios(
    "/news",
    { method: "POST", withCredentials: true },
    {
      immediate: false,
      onError: () =>
        showAlert({
          variant: "error",
          message: "新增消息失敗，請稍後再試。",
        }),
    },
  ).refresh;
  const updateNew = useAxios(
    (params) => `/news/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    {
      immediate: false,
      onError: () =>
        showAlert({
          variant: "error",
          message: "更新消息失敗，請稍後再試。",
        }),
    },
  ).refresh;

  const deleteNew = useAxios(
    (params) => `/news/${params?.id}`,
    { method: "DELETE", withCredentials: true },
    {
      immediate: false,
      onError: () =>
        showAlert({
          variant: "error",
          message: "刪除消息失敗，請稍後再試。",
        }),
    },
  ).refresh;

  const refreshNew = useAxios(
    (params) => `/news/${params?.id}`,
    { withCredentials: true },
    { immediate: false },
  ).refresh;

  // 新增、更新、刪除消息
  const handleNew = async (
    action: "add" | "update" | "delete",
    newData: Partial<NewsItem> & { _id?: string },
  ) => {
    // 驗證表單
    if (action === "add" || action === "update") {
      const form = document.getElementById("newsForm") as HTMLFormElement;
      if (!form.reportValidity()) return false;
    }

    let res;
    if (action === "add") {
      const filteredData = filterFormData(newData);
      res = await addNew(filteredData);
    } else if (action === "update") {
      const filteredData = filterFormData(newData);
      const changedData = Object.fromEntries(
        Object.entries(filteredData).filter(
          ([key, value]) =>
            JSON.stringify(value) !==
            JSON.stringify(originalDataRef.current[key]),
        ),
      );
      if (Object.keys(changedData).length === 0) return false;
      res = await updateNew({ id: newData._id }, { data: changedData });
    } else if (action === "delete") {
      if (!newData._id) return;
      res = await deleteNew({ id: newData._id });
    }

    if (res?.success) refreshNews();
    return res?.success ?? false;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3>消息管理</h3>
        <Button
          onClick={() =>
            (
              document.getElementById("addNewsModal") as HTMLDialogElement
            ).showModal()
          }
          className="h-9"
        >
          新增消息
        </Button>
        <Modal
          id="addNewsModal"
          title="新增消息"
          confirmText="新增"
          onConfirm={() => handleNew("add", formData)}
          onClose={resetForm}
          width="max-w-xl"
          isShowCloseIcon
          showAlert
        >
          <NewForm
            key={formKey}
            formData={formData}
            setFormData={setFormData}
          />
        </Modal>
      </div>
      {news?.length > 0 ? (
        <ul className="px-4 overflow-y-auto border shadow max-h-80">
          {news?.map((item) => (
            <li
              className="flex items-center justify-between py-3 border-b border-gray-300 border-dashed"
              key={item._id}
            >
              <p className="overflow-hidden truncate hover:opacity-80 whitespace-nowrap">
                {item.title}
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="icon"
                  icon={EditIcon}
                  onClick={async () => {
                    const res = await refreshNew({ id: item._id });
                    if (res?.newsItem) {
                      setFormData(res.newsItem);
                      originalDataRef.current = res.newsItem;
                      setFormKey((prev) => prev + 1);
                      (
                        document.getElementById(
                          `updateNewsModal-${item._id}`,
                        ) as HTMLDialogElement
                      ).showModal();
                    }
                  }}
                  className="border-none h-fit"
                />
                <Modal
                  id={`updateNewsModal-${item._id}`}
                  confirmText="更新"
                  onConfirm={() => handleNew("update", formData)}
                  onClose={resetForm}
                  width="max-w-xl"
                  isShowCloseIcon
                  showAlert
                >
                  <NewForm
                    key={formKey}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </Modal>
                <Button
                  variant="icon"
                  icon={CloseIcon}
                  onClick={() =>
                    (
                      document.getElementById(
                        `deleteNewsModal-${item._id}`,
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                  className="border-none h-fit"
                />
                <Modal
                  id={`deleteNewsModal-${item._id}`}
                  title="確定要刪除此消息嗎？"
                  confirmText="刪除"
                  onConfirm={() => handleNew("delete", { _id: item._id })}
                  showAlert
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>尚無任何消息...</p>
      )}
    </>
  );
};

export default NewsManager;
