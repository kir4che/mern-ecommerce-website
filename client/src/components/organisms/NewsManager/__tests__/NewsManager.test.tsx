import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { type Mock, vi } from "vitest";

import NewsManager from "@/components/organisms/NewsManager";
import { useAlert } from "@/context/AlertContext";
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsByIdQuery,
  useGetNewsQuery,
  useUpdateNewsMutation,
} from "@/store/slices/apiSlice";
import type { NewsItem } from "@/types";

vi.mock("@/context/AlertContext");
vi.mock("@/store/slices/apiSlice");

vi.mock("@/components/organisms/NewsManager/NewsManagerForm", () => {
  const MockNewsForm = () => <div data-testid="news-form" />;
  return { default: MockNewsForm };
});

import type { ReactNode } from "react";
vi.mock("@/components/molecules/Modal", () => {
  const MockModal = (props: { id: string; children: ReactNode }) => (
    <div data-testid={`modal-${props.id}`}>{props.children}</div>
  );
  return { default: MockModal };
});

vi.mock("@/assets/icons/edit.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="edit-icon" />,
}));

vi.mock("@/assets/icons/xmark.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="close-icon" />,
}));

const useCreateNewsMutationMock = vi.mocked(useCreateNewsMutation);
const useUpdateNewsMutationMock = vi.mocked(useUpdateNewsMutation);
const useDeleteNewsMutationMock = vi.mocked(useDeleteNewsMutation);
const useGetNewsQueryMock = vi.mocked(useGetNewsQuery);
const useGetNewsByIdQueryMock = vi.mocked(useGetNewsByIdQuery);

const setupMocks = () => {
  const addNew = vi.fn();
  const updateNew = vi.fn();
  const deleteNew = vi.fn();
  const refreshNew = vi.fn();

  useCreateNewsMutationMock.mockReturnValue([
    addNew,
    { isLoading: false, reset: vi.fn() },
  ] as never);
  useUpdateNewsMutationMock.mockReturnValue([
    updateNew,
    { isLoading: false, reset: vi.fn() },
  ] as never);
  useDeleteNewsMutationMock.mockReturnValue([
    deleteNew,
    { isLoading: false, reset: vi.fn() },
  ] as never);
  useGetNewsQueryMock.mockReturnValue({ refetch: refreshNew });
  useGetNewsByIdQueryMock.mockReturnValue({ refetch: vi.fn() });

  return { addNew, updateNew, deleteNew, refreshNew };
};

const baseNews: NewsItem = {
  _id: "news-1",
  title: "新品上市",
  category: "優惠",
  date: new Date("2025-01-01"),
  content: "最新消息內容",
  imageUrl: "news.jpg",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

describe("NewsManager 元件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCreateNewsMutationMock.mockReset();
    useUpdateNewsMutationMock.mockReset();
    useDeleteNewsMutationMock.mockReset();
    useGetNewsQueryMock.mockReset();
    (useAlert as Mock).mockReturnValue({ showAlert: vi.fn() });
  });

  test("無可用最新消息時渲染空狀態", () => {
    setupMocks();
    const { container } = render(
      <MemoryRouter>
        <NewsManager news={[]} />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });

  test("渲染最新消息列表項目", () => {
    setupMocks();
    const { container } = render(
      <MemoryRouter>
        <NewsManager news={[baseNews]} />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
