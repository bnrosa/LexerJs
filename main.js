const Recognizer = require("./Recognizer.js");

const reco = new Recognizer();
let output = reco.isString.runInput("stringwefwef");
//output = reco.isTrue.runInput("trdfwefue");
output = reco.isNumber("5");
//console.log(output);
console.log(reco.isIdentifier("_apple"));
console.log(reco.isIdentifier("a_apple"));
console.log(reco.isIdentifier("a_1234apple"));
console.log(reco.isIdentifier("1a_apple"));
console.log(reco.isIdentifier("$a_apple"));
console.log(reco.isIdentifier("a_ap%ple"));
