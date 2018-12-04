const Pilautomata = require("./Pilautomata");
const Rules = require("./Rules");
module.exports = class Parser {
  readRules(tokens) {
    //Format special tokens
    for (let j = 0; j < tokens.length; j++) {
      if (tokens[j].type == "Identifier") {
        tokens[j]["grammarToken"] = "identifier";
      } else if (tokens[j].type == "Number") {
        tokens[j]["grammarToken"] = "number";
      } else if (tokens[j].type == "String") {
        tokens[j]["grammarToken"] = "cadeCaracters";
      } else if (
        tokens[j].type == "Relational Operator" &&
        tokens[j].value != "="
      ) {
        tokens[j]["grammarToken"] = "relationalOperator";
      } else if (
        tokens[j].type == "Reserved Word" &&
        (tokens[j].value == "int" ||
          tokens[j].value == "float" ||
          tokens[j].value == "bool" ||
          tokens[j].value == "string" ||
          tokens[j].value == "void")
      ) {
        tokens[j]["grammarToken"] = "type";
      } else {
        tokens[j]["grammarToken"] = tokens[j].value;
      }
    }

    //State control and error handling
    let panicMode = false;
    let errors = [];
    //Reverse tokenlist
    tokens.reverse();
    let stack = ["$", "Start"];
    const rules = new Rules();
    const parsingTable = rules.completeTable();
    //console.log(tokens);
    //console.log(parsingTable);
    //Iterate till end of tokens
    while (tokens.length > 0) {
      if (stack.lenght == 0) {
        return "Error stack out of itens";
      }
      let token = tokens[tokens.length - 1].grammarToken;
      //console.log(token);
      console.log(
        tokens.length + " Stack: " + stack + "         Token: " + token
      );
      // console.log("Current Stack Top: " + currentStackTop);
      if (!panicMode) {
        let currentStackTop = stack.pop();
        if (currentStackTop == token) {
          tokens.pop();
        } else {
          let rule = parsingTable.find(
            e =>
              e.nonTerminal == currentStackTop &&
              e.terminal == token &&
              e.type == "normal"
          );
          // Enters panic mode
          if (rule == undefined) {
            panicMode = true;
            let errorRule = parsingTable.find(
              e =>
                e.nonTerminal == currentStackTop &&
                e.terminal == token &&
                e.type == "error"
            );
            //In case it is not a sync token
            if (errorRule == undefined) {
              let errorToken = tokens.pop();
              errors.push(errorToken);
            }
            //In case it is a sync token
            else {
              panicMode = false;
              let errorToken = tokens.pop();
              errors.push(errorToken);
            }
          } // If a rule is found it goes normal
          else {
            //console.log("Rule:" + rule);
            for (let i = rule.production.length - 1; i >= 0; i--) {
              if (rule.production[i] != "ε") {
                stack.push(rule.production[i]);
              }
            }
          }
        }
      }
      //In panic mode already
      else {
        let currentStackTop = stack[stack.length - 1];
        let errorRule = parsingTable.find(
          e =>
            e.nonTerminal == currentStackTop &&
            e.terminal == token &&
            e.type == "error"
        );
        //In case it is not a sync token
        if (errorRule == undefined) {
          tokens.pop();
          //errors.push(errorToken);
        }
        //In case it is a sync token
        else {
          stack.pop();
          panicMode = false;
          //errors.push(errorToken);
        }
      }
    }
    if (errors.length == 0) {
      return "Success!";
    } else {
      return errors;
    }
  }
};
