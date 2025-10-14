import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PageHeader from "@/components/molecules/PageHeader";

test("renders breadcrumb and titles correctly", () => {
  render(
    <MemoryRouter>
      <PageHeader breadcrumbText="首頁" titleEn="Home" titleCh="首頁" />
    </MemoryRouter>
  );

  const homeLinks = screen.getAllByText("首頁");
  expect(homeLinks.length).toBeGreaterThan(1); // 確保至少有兩個 "首頁" 元素
  expect(screen.getByText("Home")).toBeInTheDocument();
});
