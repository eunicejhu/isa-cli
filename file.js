const path = require("path");

module.exports = {
  getCurrentDirectoryName: () => path.basename(process.cwd()),
};
