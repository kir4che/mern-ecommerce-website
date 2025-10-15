import { useState } from "react";
import { throttle } from "lodash";

import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";

import type { UploadImageResponse } from "@/types/api";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

import UploadIcon from "@/assets/icons/upload.inline.svg?react";
import SuccessIcon from "@/assets/icons/success.inline.svg?react";
import ErrorIcon from "@/assets/icons/error.inline.svg?react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploadInput = ({
  label = "圖片上傳",
  required = false,
  setFormData,
}) => {
  const { showAlert } = useAlert();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      showAlert({
        variant: "error",
        message: "請選擇圖片格式的檔案。",
      });
      return;
    }

    // 檢查檔案大小，限制 5MB。
    if (file.size > MAX_FILE_SIZE) {
      showAlert({
        variant: "error",
        message: "圖片大小超過 5MB，請重新上傳。",
      });
      return;
    }

    setImageFile(file);
  };

  const { isLoading, isSuccess, isError, refresh } =
    useAxios<UploadImageResponse>(
      "/upload/image",
      {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      },
      {
        immediate: false,
        onSuccess: (resData) =>
          setFormData((prev) => ({ ...prev, imageUrl: resData.imageUrl })),
        onError: () =>
          showAlert({
            variant: "error",
            message: "上傳圖片失敗，請稍後再試。",
          }),
      }
    );

  const uploadLogic = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    void refresh(formData);
  };

  const handleImageUpload = throttle(() => uploadLogic(), 1000, {
    leading: true,
    trailing: false,
  });

  return (
    <div className="flex items-center justify-between gap-x-4">
      <Input
        id="imageFile"
        name="imageFile"
        label={label}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        helperText="Max size 5MB"
        inputStyle="border-none px-0"
        required={required}
      />
      <div className="flex items-center gap-x-1">
        <Button
          variant="icon"
          icon={!isLoading && UploadIcon}
          onClick={handleImageUpload}
          className={`border-none hover:opacity-75 ${isLoading ? "h-10 w-20" : ""}`}
          disabled={isLoading}
        >
          上傳
          {isLoading && (
            <span
              className="ml-1 loading loading-spinner loading-xs"
              data-testid="loading-icon"
            />
          )}
        </Button>
        {isSuccess && (
          <SuccessIcon
            className="w-5 h-5 stroke-green-500"
            data-testid="success-icon"
          />
        )}
        {isError && (
          <ErrorIcon
            data-testid="error-icon"
            className="w-5 h-5 stroke-red-500"
          />
        )}
      </div>
    </div>
  );
};

export default ImageUploadInput;
