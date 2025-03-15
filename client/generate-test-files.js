const fs = require("fs");
const path = require("path");

// 定義 components 目錄
const componentsDir = path.join(__dirname, "src", "components");
const categories = ["atoms", "molecules", "organisms"]; // 只遍歷這三個分類

// 遞歸處理每個分類
categories.forEach((category) => {
  const categoryPath = path.join(componentsDir, category);

  if (fs.existsSync(categoryPath)) {
    // 讀取所有組件
    fs.readdirSync(categoryPath).forEach((component) => {
      const componentPath = path.join(categoryPath, component);

      // 檢查是否為資料夾（確保是組件資料夾）
      if (fs.statSync(componentPath).isDirectory()) {
        const testDir = path.join(componentPath, "__tests__");
        const testFilePath = path.join(testDir, `${component}.test.tsx`);

        // 創建 __tests__ 目錄（如果不存在）
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        // 創建測試檔案（如果不存在）
        if (!fs.existsSync(testFilePath)) {
          const testContent = `import { render, screen } from '@testing-library/react';\nimport ${component} from '@/components/${category}/${component}';\n\n`;

          fs.writeFileSync(testFilePath, testContent);
          console.log(`✅ 已創建 ${component} 測試檔案: ${testFilePath}`);
        }
      }
    });
  }
});
