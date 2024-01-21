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
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
// 檢查使用者權限
const checkUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_middleware_1.default)(req);
    const { role } = req.session.user || {};
    if (role == 'admin')
        next();
    else
        res.status(403).json({ message: 'Permission denied. Only admins can add products.' });
});
exports.default = checkUserRole;
//# sourceMappingURL=checkUserRole.js.map