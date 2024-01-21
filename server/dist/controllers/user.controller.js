"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.getUserData = exports.createNewUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cart_model_1 = require("../models/cart.model");
const user_model_1 = require("../models/user.model");
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found!' });
        res.status(200).json({
            message: 'User fetched Successfully!',
            user: {
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ message: 'Token has expired.' });
        else
            return res.status(401).json({ message: 'Unauthorized!' });
    }
});
exports.getUserData = getUserData;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // 先確認該 email 是否已經被註冊過
        const isNewUser = yield user_model_1.UserModel.findOne({ email });
        if (isNewUser)
            return res.status(400).json({ message: 'User already Exists!' });
        // 將 password 進行 hash
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // 建立新的 user
        const newUser = new user_model_1.UserModel({ name, email, password: hashedPassword });
        yield newUser.save();
        const newCart = new cart_model_1.CartModel({ userId: newUser._id, items: [] });
        yield newCart.save();
        res.status(201).json({ message: 'User registered Successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.createNewUser = createNewUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // 確認該 email 是否已經被註冊過
        const user = yield user_model_1.UserModel.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User does'nt Exist!" });
        // 確認 password 是否正確
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch)
            return res.status(400).json({ message: 'Invalid Password!' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d',
        });
        req.session.user = {
            name: user.name,
            email: user.email,
            role: user.role,
        };
        req.session.save(); // 儲存 session
        res.status(200).json({ message: 'User logged in Successfully!', user: req.session.user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((err) => {
            if (err)
                throw new Error(err);
        });
        res.status(200).json({ message: 'User logged out Successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=user.controller.js.map