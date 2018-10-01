const fs = require("fs");
module.exports = class Editor {
  readfiles(dirName) {
    const filesContent = [];
    let files = fs.readdirSync(dirName);
    if (Array.isArray(files)) {
      files.forEach(function(fileName) {
        let content = fs.readFileSync(dirName + "/" + fileName, "utf8");
        filesContent.push({
          fileName,
          content
        });
      });
    } else {
      return "No files found";
    }
    return filesContent;
  }

  writefile(fileName) {}
};
