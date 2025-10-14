import { render, screen, fireEvent } from "@testing-library/react";
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

test("ThemeContext works correctly", () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByText("light")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Toggle Theme"));
  expect(screen.getByText("dark")).toBeInTheDocument();
});
