const Recognizer = require("./Recognizer.js");
const Editor = require("./Editor");
const Lexer = require("./Lexer.js");
const fs = require("fs");

const reco = new Recognizer();
const editor = new Editor();
//let output = reco.isString.runInput("stringwefwef");

//Testing identifier automata
// console.log(reco.isIdentifier.runInput("Apple1#"));
// console.log(reco.isIdentifier.runInput("a_apple"));
// console.log(reco.isIdentifier.runInput("a_1234apple"));
// console.log(reco.isIdentifier.runInput("1a_apple"));
// console.log(reco.isIdentifier.runInput("$a_apple"));
// console.log(reco.isIdentifier.runInput("a_ap%ple"));

// Testing number automata
// console.log(reco.isNumber.runInput("5.$"));
// console.log(reco.isNumber.runInput("5.333$"));
// console.log(reco.isNumber.runInput("5.440$"));
// console.log(reco.isNumber.runInput("-252"));
// console.log(reco.isNumber.runInput("-75.30"));
// console.log(reco.isNumber.runInput("-   52"));

// Testing string automata

// //Teste lexer on console
// const filesContent = editor.readfiles("test");
// //console.log(filesContent);
// let lex = new Lexer(filesContent[2].content);
// let output = lex.getAll();
// console.log(output);

//Filestream lexer
const filesContent = editor.readfiles("test");
filesContent.forEach(file => {
  let lex = new Lexer(file.content);
  output = lex.getAll();
  let flArr = file.fileName.split(".");
  name = flArr[0];
  if (output.some(e => e.type == "Error")) {
    fs.appendFileSync("./test/" + name + "_errors.txt", "Errors:\n");
    output.forEach(error => {
      fs.appendFileSync(
        "./test/" + name + "_errors.txt",
        "Error " +
          error.errorMsg +
          ": " +
          error.value +
          " . Line: " +
          error.line +
          "\n"
      );
    });
  } else {
    fs.appendFileSync(
      "./test/" + name + "_success.txt",
      "Success! Tokens identified are:\n"
    );
    output.forEach(token => {
      fs.appendFileSync(
        "./test/" + name + "_success.txt",
        "Token type: " +
          token.type +
          " | Value: " +
          token.value +
          " | Line: " +
          token.line +
          "\n"
      );
    });
  }
});
