"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const cart_route_1 = require("./routes/cart.route");
const post_route_1 = require("./routes/post.route");
const product_route_1 = require("./routes/product.route");
const user_route_1 = require("./routes/user.route");
const order_route_1 = require("./routes/order.route");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use((0, express_session_1.default)({
    secret: Math.random().toString(36).substring(2),
    saveUninitialized: true, // 固定寫法: 是否保存初始化的 session
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        secure: false, // true: 只有 https 才能使用 cookie
    },
}));
app.use(express_1.default.static('public'));
app.use('/api/user', user_route_1.userRouter);
app.use('/api/products', product_route_1.productRouter);
app.use('/api/posts', post_route_1.postRouter);
app.use('/api/cart', cart_route_1.cartRouter);
app.use('/api/orders', order_route_1.orderRouter);
mongoose_1.default
    .connect(process.env.MONGO_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on ${process.env.BACKEND_URL}`);
});
//# sourceMappingURL=app.js.map