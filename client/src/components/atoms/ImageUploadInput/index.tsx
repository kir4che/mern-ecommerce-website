import { throttle } from "lodash-es";
import { useRef, useState } from "react";

import { useAlert } from "@/context/AlertContext";
import { useUploadImageMutation } from "@/store/slices/apiSlice";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import ErrorIcon from "@/assets/icons/error.inline.svg?react";
import SuccessIcon from "@/assets/icons/success.inline.svg?react";
import XmarkIcon from "@/assets/icons/xmark.inline.svg?react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ImageUploadInputProps<T> {
  label?: string;
  required?: boolean;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
}

const ImageUploadInput = <
  T extends { imageUrl?: string; [key: string]: unknown },
>({
  label = "首圖上傳",
  required = false,
  setFormData,
}: ImageUploadInputProps<T>) => {
  const { showAlert } = useAlert();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadImage, { isLoading, isSuccess, isError }] =
    useUploadImageMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert({ variant: "error", message: "請選擇圖片格式的檔案。" });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showAlert({
        variant: "error",
        message: "圖片大小超過 5MB，請重新上傳。",
      });
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleClear = () => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadLogic = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await uploadImage(formData).unwrap();
      setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }) as T);
    } catch {
      showAlert({ variant: "error", message: "上傳圖片失敗，請稍後再試。" });
    }
  };

  const handleImageUpload = throttle(() => uploadLogic(), 1000, {
    leading: true,
    trailing: false,
  });

  return (
    <div className="flex w-full gap-x-3 items-center">
      <div className="w-full flex-1">
        <Input
          ref={fileInputRef}
          id="imageFile"
          name="imageFile"
          label={label}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          helperText="Max size 5MB"
          required={required}
          inputClassName="pt-[0.35rem] cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded file:bg-gray-100 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 transition-all text-sm outline-none"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {imageFile && (
          <Button
            variant="icon"
            icon={XmarkIcon}
            onClick={handleClear}
            disabled={isLoading}
            className="rounded-full text-red-600 hover:bg-red-50"
          />
        )}
        <Button
          variant="secondary"
          onClick={handleImageUpload}
          disabled={isLoading || !imageFile}
        >
          <div className="flex-center gap-2">
            <span>上傳</span>
            {isLoading && (
              <span className="loading loading-spinner loading-xs" />
            )}
            {isSuccess && <SuccessIcon className="size-5 text-green-500" />}
            {isError && <ErrorIcon className="size-5 text-red-500" />}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadInput;
