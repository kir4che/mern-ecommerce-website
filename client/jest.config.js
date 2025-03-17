module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // 設定 jsdom 模擬瀏覽器環境
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // 解析 TypeScript 檔案
  },
  transformIgnorePatterns: ["/node_modules/(?!axios|lodash-es)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // 設定 @ 指向 src
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^axios$": "axios/dist/node/axios.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // 設定 Jest 環境
};
