import guestCartReducer, {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
  setItems,
} from "@/store/slices/guestCartSlice";
import type { CartItemInput } from "@/types";
import { describe, expect, it } from "vitest";

const empty = { items: [] as CartItemInput[] };

describe("guestCartSlice", () => {
  describe("addItem", () => {
    it("productId 不存在時新增項目", () => {
      const state = guestCartReducer(
        empty,
        addItem({ productId: "product-1", quantity: 2 })
      );
      expect(state.items).toEqual([{ productId: "product-1", quantity: 2 }]);
    });

    it("productId 已存在時累加數量", () => {
      const state = guestCartReducer(
        { items: [{ productId: "product-1", quantity: 2 }] },
        addItem({ productId: "product-1", quantity: 3 })
      );
      expect(state.items).toEqual([{ productId: "product-1", quantity: 5 }]);
    });
  });

  describe("removeItem", () => {
    it("依 productId 移除項目，保留其他項目", () => {
      const state = guestCartReducer(
        {
          items: [
            { productId: "product-1", quantity: 2 },
            { productId: "product-2", quantity: 1 },
          ],
        },
        removeItem("product-1")
      );
      expect(state.items).toEqual([{ productId: "product-2", quantity: 1 }]);
    });
  });

  describe("changeItemQuantity", () => {
    it("更新現有項目的數量", () => {
      const state = guestCartReducer(
        { items: [{ productId: "product-1", quantity: 2 }] },
        changeItemQuantity({ productId: "product-1", quantity: 10 })
      );
      expect(state.items).toEqual([{ productId: "product-1", quantity: 10 }]);
    });

    it("找不到 productId 時不執行任何操作", () => {
      const state = guestCartReducer(
        { items: [{ productId: "product-1", quantity: 2 }] },
        changeItemQuantity({ productId: "p99", quantity: 10 })
      );
      expect(state.items).toEqual([{ productId: "product-1", quantity: 2 }]);
    });
  });

  describe("clearItems", () => {
    it("清空項目陣列", () => {
      const state = guestCartReducer(
        { items: [{ productId: "product-1", quantity: 2 }] },
        clearItems()
      );
      expect(state.items).toEqual([]);
    });
  });

  describe("setItems", () => {
    it("用提供的陣列替換所有項目", () => {
      const newItems = [{ productId: "product-2", quantity: 3 }];
      const state = guestCartReducer(
        { items: [{ productId: "product-1", quantity: 2 }] },
        setItems(newItems)
      );
      expect(state.items).toEqual(newItems);
    });
  });
});
