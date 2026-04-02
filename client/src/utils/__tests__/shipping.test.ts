import {
  calculateShippingFee,
  getRemainingForFreeShipping,
  getShippingProgress,
  isFreeShipping,
} from "@/utils/shipping";

describe("計算運費函式", () => {
  test("calculateShippingFee 低於門檻時回傳基本運費", () => {
    expect(calculateShippingFee(499)).toBe(60);
  });

  test("calculateShippingFee 達到門檻時回傳免費", () => {
    expect(calculateShippingFee(500)).toBe(0);
    expect(calculateShippingFee(999)).toBe(0);
  });

  test("getShippingProgress 回傳四捨五入的百分比且最高為 100", () => {
    expect(getShippingProgress(0)).toBe(0);
    expect(getShippingProgress(249)).toBe(50);
    expect(getShippingProgress(500)).toBe(100);
    expect(getShippingProgress(800)).toBe(100);
  });

  test("getRemainingForFreeShipping 永不回傳負數", () => {
    expect(getRemainingForFreeShipping(100)).toBe(400);
    expect(getRemainingForFreeShipping(500)).toBe(0);
    expect(getRemainingForFreeShipping(700)).toBe(0);
  });

  test("假設 isFreeShipping 判斷購物金額是否免運費", () => {
    expect(isFreeShipping(300)).toBe(false);
    expect(isFreeShipping(500)).toBe(true);
  });
});
