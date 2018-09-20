const Recognizer = require("./Recognizer.js");

const reco = new Recognizer();
let output = reco.isString.runInput("stringwefwef");
//output = reco.isTrue.runInput("trdfwefue");
console.log(output);
