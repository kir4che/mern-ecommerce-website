import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { useAxios } from "@/hooks/useAxios";

const mock = new AxiosMockAdapter(axios);

const TestComponent = ({ url }: { url: string }) => {
  const { data, error, isLoading, isSuccess, isError } = useAxios(url);

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
    await waitFor(() => {
      expect(screen.getByText(/Data:/)).toBeInTheDocument();
      expect(screen.getByText(/"success":true/)).toBeInTheDocument();
    });
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
});
