module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // 設定 jsdom 模擬瀏覽器環境
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  url: ({ fileName }) => `file://${fileName}`,
                  env: {
                    VITE_API_URL:
                      process.env.VITE_API_URL || "http://localhost:3000",
                  },
                },
              },
            },
          ],
        },
      },
    ], // 解析 TypeScript 檔案並替換 import.meta
    "^.+\\.(gif|jpe?g|tiff?|png|webp|bmp)$":
      "<rootDir>/__mocks__/fileTransformer.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios|lodash-es)"],
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgrMock.tsx",
    "^@/(.*)$": "<rootDir>/src/$1", // 設定 @ 指向 src
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^swiper/react$": "<rootDir>/__mocks__/swiperReactMock.tsx",
    "^swiper/modules$": "<rootDir>/__mocks__/swiperModulesMock.ts",
    "^swiper/css$": "<rootDir>/__mocks__/styleMock.js",
    "^swiper/css/navigation$": "<rootDir>/__mocks__/styleMock.js",
    "^axios$": "axios/dist/node/axios.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // 設定 Jest 環境
};
