const grammar = require("./grammar.js");
const fs = require("fs");
for (let rule of grammar) {
  let ruleName = rule.left.replace(/\s/g, "");
  for (let productionSet of rule.right) {
    fs.appendFileSync("grammar2.txt", ruleName + " -> ");
    for (let production of productionSet) {
      fs.appendFileSync("grammar2.txt", production.replace(/\s/g, "") + " ");
    }
    fs.appendFileSync("grammar2.txt", "\n");
  }
}
