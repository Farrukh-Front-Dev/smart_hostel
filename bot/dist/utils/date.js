"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.getCurrentMonth = void 0;
const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
exports.getCurrentMonth = getCurrentMonth;
const formatDate = (date = new Date()) => {
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};
exports.formatDate = formatDate;
//# sourceMappingURL=date.js.map