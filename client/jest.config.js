module.exports = {
  testEnvironment: "jsdom", // 設定 jsdom 模擬瀏覽器環境
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // 解析 TypeScript 檔案
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // 設定 @ 指向 src
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // 設定 Jest 環境
};
