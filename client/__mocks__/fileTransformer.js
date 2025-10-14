const path = require("path");

module.exports = {
  process(_src, filename) {
    const baseName = path.basename(filename);
    return { code: `module.exports = ${JSON.stringify(baseName)};` };
  },
};
