const Rules = require("./Rules");
const rules = new Rules();
const Parser = require("./Parser");
const Recognizer = require("../lexer/Recognizer.js");
const Editor = require("../lexer/Editor");
const Lexer = require("../lexer/Lexer.js");
const fs = require("fs");

const reco = new Recognizer();
const editor = new Editor();
rules.rules.forEach(element => {
  // console.log(
  //   "'" +
  //     element.left +
  //     "' - First: " +
  //     element.first +
  //     " Follow: " +
  //     element.follow
  // );
  // for (prod of element.right) {
  //   //console.log(prod);
  //   console.log(rules.getFirstRight(prod));
  // }
});
const parse = new Parser();
// let log = parse.readRules([
//   "if",
//   "(",
//   "identifier",
//   ">",
//   "number",
//   ")",
//   "then",
//   "{",
//   "identifier",
//   "=",
//   "number",
//   "}"
// ]);

// console.log(log);
let output;
let log;
const filesContent = editor.readfiles("test");
for (let file of filesContent) {
  let flArr = file.fileName.split(".");
  let nameOfFile = flArr[0];
  let lex = new Lexer(file.content);
  output = lex.getAll();
  if (output[0].type == "error") {
    console.log("LEXICAL ERROR!");
    break;
  }
  // for (let e of output) {
  //   console.log(e);
  // }
  log = parse.readRules(output);
  if (Array.isArray(log)) {
    for (let errorToken of log) {
      fs.appendFileSync(
        "./test/" + nameOfFile + "_errors.txt",
        "Synthax error at line " +
          errorToken.line +
          ", invalid token '" +
          errorToken.value +
          "' read.\n"
      );
    }
  } else {
    fs.appendFileSync(
      "./test/" + nameOfFile + "_success.txt",
      "Tokens reconhecidos com sucesso!"
    );
  }
}
