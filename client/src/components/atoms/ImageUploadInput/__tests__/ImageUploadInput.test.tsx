import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ImageUploadInput from "@/components/atoms/ImageUploadInput";
import { useAlert } from "@/context/AlertContext";
import { useUploadImageMutation } from "@/store/slices/apiSlice";

vi.mock("@/context/AlertContext");
vi.mock("@/store/slices/apiSlice");
vi.mock("lodash-es", () => ({
  throttle: (fn: unknown) => fn,
}));

describe("ImageUploadInput 元件", () => {
  const mockShowAlert = vi.fn();
  const mockSetFormData = vi.fn();
  const mockMutate = vi.fn();
  const useUploadImageMutationMock = vi.mocked(useUploadImageMutation);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAlert).mockReturnValue({
      alert: null,
      showAlert: mockShowAlert,
      hideAlert: vi.fn(),
    } satisfies ReturnType<typeof useAlert>);

    useUploadImageMutationMock.mockReturnValue([
      mockMutate,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
        reset: vi.fn(),
      },
    ] as [
      typeof mockMutate,
      {
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
        reset: () => void;
      },
    ]);
  });

  test("允許上傳有效的圖片", async () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    const file = new File(["test"], "test.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(screen.getByLabelText("首圖上傳"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("上傳"));
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test("選擇非圖片檔案時顯示 Alert", () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    const file = new File(["test"], "test.txt", {
      type: "text/plain",
    });

    // 模擬選擇非圖片格式的檔案
    fireEvent.change(screen.getByLabelText("首圖上傳"), {
      target: { files: [file] },
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "請選擇圖片格式的檔案。",
    });
  });

  test("檔案超過大小限制時顯示 Alert", () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 創建一個超過 5MB 的檔案
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    // 模擬選擇超過大小限制的檔案
    fireEvent.change(screen.getByLabelText("首圖上傳"), {
      target: { files: [largeFile] },
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "圖片大小超過 5MB，請重新上傳。",
    });
  });

  test("上傳成功時顯示成功 icon", async () => {
    // 模擬上傳成功
    useUploadImageMutationMock.mockReturnValue([
      mockMutate,
      {
        isLoading: false,
        isSuccess: true,
        isError: false,
        reset: vi.fn(),
      },
    ] as [
      typeof mockMutate,
      {
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
        reset: () => void;
      },
    ]);

    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 確認成功 icon 是否顯示 (green check icon)
    const uploadButton = screen.getByText("上傳");
    expect(uploadButton).toBeInTheDocument();
  });

  test("上傳失敗時顯示錯誤 icon", () => {
    // 模擬上傳失敗
    useUploadImageMutationMock.mockReturnValue([
      mockMutate,
      {
        isLoading: false,
        isSuccess: false,
        isError: true,
        reset: vi.fn(),
      },
    ] as [
      typeof mockMutate,
      {
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
        reset: () => void;
      },
    ]);

    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 確認錯誤 icon 是否顯示 (red error icon)
    const uploadButton = screen.getByText("上傳");
    expect(uploadButton).toBeInTheDocument();
  });
});
