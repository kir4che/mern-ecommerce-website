import { render, screen, waitFor } from "@testing-library/react";
import AxiosMockAdapter from "axios-mock-adapter";
import { api, useAxios } from "@/hooks/useAxios";

const mock = new AxiosMockAdapter(api);

const TestComponent = ({
  url,
  onSuccess,
  onError,
}: {
  url: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) => {
  const { data, error, isLoading, isSuccess, isError } = useAxios(
    url,
    {},
    { onSuccess, onError },
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (isSuccess) return <div>Data: {JSON.stringify(data)}</div>;

  return null;
};

describe("useAxios hook", () => {
  afterEach(() => mock.reset());

  test("returns data on successful request", async () => {
    // 模擬成功的請求，回傳 200 和 data。
    mock.onAny().reply(() => {
      return [200, { success: true, data: "some data" }];
    });

    render(<TestComponent url="/some-url" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await screen.findByText(/Data:/);
    await screen.findByText(/"success":true/);
  });

  test("returns error on failed request", async () => {
    // 模擬失敗的請求，回傳 500 和錯誤訊息。
    mock.onAny().reply(() => {
      return [500, { message: "Request failed", statusCode: 500 }];
    });

    render(<TestComponent url="/some-url" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test("calls onSuccess callback on successful request", async () => {
    const mockOnSuccess = jest.fn();

    // 模擬一個成功的請求，回傳 200 和 data。
    mock.onAny().reply(() => {
      return [200, { success: true, data: "some data" }];
    });

    render(<TestComponent url="/some-url" onSuccess={mockOnSuccess} />);

    await screen.findByText(/Data:/);

    // 確認 onSuccess 是否正確被呼叫，並傳入正確的資料。
    expect(mockOnSuccess).toHaveBeenCalledWith({
      success: true,
      data: "some data",
    });
  });

  test("calls onError callback on failed request", async () => {
    const mockOnError = jest.fn();

    // 模擬一個失敗的請求，回傳 500 和錯誤訊息。
    mock.onAny().reply(() => {
      return [500, { message: "Request failed", statusCode: 500 }];
    });

    render(<TestComponent url="/some-url" onError={mockOnError} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // 等待錯誤訊息顯示
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    // 確認 onError 是否正確被呼叫，並傳入錯誤訊息。
    expect(mockOnError).toHaveBeenCalledWith({
      message: "Request failed",
      statusCode: 500,
    });
  });
});
