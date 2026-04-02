import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, test } from "vitest";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>{theme}</p>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  test("正確切換主題", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // 初始要是 light
    expect(screen.getByText("light")).toBeInTheDocument();

    // 點擊切換主題
    fireEvent.click(screen.getByText("Toggle Theme"));
    expect(screen.getByText("dark")).toBeInTheDocument();
  });
});
