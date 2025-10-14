import { render, screen } from "@testing-library/react";
import NewsManager from "@/components/organisms/NewsManager";
import type { NewsItem } from "@/types/news";
import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";

jest.mock("@/hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("@/context/AlertContext", () => ({
  useAlert: jest.fn(),
}));

jest.mock("@/components/organisms/NewsManager/Form", () => () => (
  <div data-testid="news-form" />
));

jest.mock("@/components/molecules/Modal", () => (props: any) => (
  <div data-testid={`modal-${props.id}`}>{props.children}</div>
));

jest.mock("@/assets/icons/edit.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="edit-icon" />,
}));

jest.mock("@/assets/icons/xmark.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="close-icon" />,
}));

const mockUseAxios = useAxios as jest.Mock;

const setupAxiosMocks = () => {
  const addNew = jest.fn();
  const updateNew = jest.fn();
  const deleteNew = jest.fn();
  const refreshNew = jest.fn();

  mockUseAxios
    .mockReturnValueOnce({ refresh: addNew })
    .mockReturnValueOnce({ refresh: updateNew })
    .mockReturnValueOnce({ refresh: deleteNew })
    .mockReturnValueOnce({ refresh: refreshNew });

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

describe("NewsManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxios.mockReset();
    (useAlert as jest.Mock).mockReturnValue({ showAlert: jest.fn() });
  });

  test("renders empty state when no news available", () => {
    setupAxiosMocks();

    render(<NewsManager news={[]} refreshNews={jest.fn()} />);

    expect(screen.getByText("尚無任何消息...")).toBeInTheDocument();
  });

  test("renders news list items", () => {
    setupAxiosMocks();

    render(<NewsManager news={[baseNews]} refreshNews={jest.fn()} />);

    expect(screen.getByText("消息管理")).toBeInTheDocument();
    expect(screen.getByText("新品上市")).toBeInTheDocument();
  });
});
