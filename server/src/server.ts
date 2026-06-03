import app from "./app";
import { OrderModel } from "./models/order.model";
import { logger } from "./utils/logger";

const port = process.env.PORT || 8080;

// 定時清理過期的未付款訂單（每 10 分鐘檢查一次）
const cleanupExpiredOrders = async () => {
  try {
    const now = new Date();
    const result = await OrderModel.updateMany(
      {
        expiresAt: { $lt: now },
        paymentStatus: "unpaid",
        status: { $ne: "canceled" }, // 只取消還沒被取消的訂單
      },
      {
        status: "canceled",
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[清理任務] 已取消 ${result.modifiedCount} 個過期訂單`);
    }
  } catch (err) {
    console.error("[清理任務] 錯誤:", err);
  }
};

setInterval(cleanupExpiredOrders, 10 * 60 * 1000);

app.listen(port, () => {
  logger.info(`Server started on http://localhost:${port}`);
  console.log(`[定時任務] 已啟動訂單過期清理任務`);
});
