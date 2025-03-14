import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploadInput from "@/components/molecules/ImageUploadInput";
import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";

jest.mock("@/context/AlertContext");
jest.mock("@/hooks/useAxios");
jest.mock("lodash", () => ({ throttle: (fn: Function) => fn }));

describe("ImageUploadInput Component", () => {
  const mockShowAlert = jest.fn();
  const mockSetFormData = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });

    (useAxios as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
      refresh: mockRefresh,
    });
  });

  test("renders the component with the correct label and upload button", () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    expect(screen.getByText("圖片上傳")).toBeInTheDocument();
    expect(screen.getByText("上傳")).toBeInTheDocument();
  });

  test("allows uploading a valid image", async () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    const file = new File(["test"], "test.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(screen.getByTestId("imageFile"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("上傳"));
    expect(mockRefresh).toHaveBeenCalled();
  });

  test("displays an error message when a non-image file is selected", () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    const file = new File(["test"], "test.txt", {
      type: "text/plain",
    });

    // 模擬選擇非圖片格式的檔案
    fireEvent.change(screen.getByTestId("imageFile"), {
      target: { files: [file] },
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "請選擇圖片格式的檔案。",
    });
  });

  test("displays an error message when a file exceeds the size limit", () => {
    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 創建一個超過 5MB 的檔案
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    // 模擬選擇超過大小限制的檔案
    fireEvent.change(screen.getByTestId("imageFile"), {
      target: { files: [largeFile] },
    });

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "圖片大小超過 5MB，請重新上傳。",
    });
  });

  test("displays a success icon when the upload is successful", async () => {
    // 模擬上傳成功
    (useAxios as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      refresh: mockRefresh,
    });

    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 確認成功 icon 是否顯示
    const successIcon = screen.getByTestId("success-icon");
    expect(successIcon).toBeInTheDocument();
  });

  test("displays an error icon when the upload fails", () => {
    // 模擬上傳失敗
    (useAxios as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: true,
      refresh: mockRefresh,
    });

    render(<ImageUploadInput setFormData={mockSetFormData} />);

    // 確認錯誤 icon 是否顯示
    const errorIcon = screen.getByTestId("error-icon");
    expect(errorIcon).toBeInTheDocument();
  });
});
