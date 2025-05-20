import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

import AppLayout from "@/layouts/AppLayout";
import { store } from "@/store";
import { AlertProvider } from "@/context/AlertContext";
import { MemoryRouter } from "react-router";

describe("AppLayout", () => {
  const renderAppLayout = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <AlertProvider>
            <AppLayout>Test Children</AppLayout>
          </AlertProvider>
        </MemoryRouter>
        ,
      </Provider>,
    );
  };

  test("sets body overflow style based on menu state", async () => {
    renderAppLayout();
    expect(document.body.style.overflow).toBe("auto");

    const menuBtn = screen.getByLabelText("開啟選單");
    // 模擬 Menu 開啟，確認 overflow 有改變。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));

    // 模擬 Menu 關閉，確認 overflow 恢復。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("auto"));
  });
});
