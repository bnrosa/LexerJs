const Reconizer = require("./Recognizer");
const Token = require("./Token");
const NoNextState = "NoNextState";

module.exports = class Lexer {
  constructor(input) {
    this.input = input;
    this.backup = input;
    this.position = 0;
    this.line = 1;
    this.tokens = [];
    this.errors = [];
  }

  getAll() {
    this.currentLexeme = this.input.charAt(this.position);
    while (this.position < this.input.length) {
      //Identify lexeme
      let recognizedOutput = this.recognize(this.currentLexeme);
      this.position++;

      if (recognizedOutput.type == "Partial") {
        //Can concat with next
        this.currentLexeme = this.currentLexeme.concat(
          this.input.charAt(this.position)
        );
        if (this.position == this.input.length) {
          if (recognizedOutput.isFinal && recognizedOutput.type != "Comment") {
            let partial = new Token(
              recognizedOutput.subtype,
              recognizedOutput.value,
              recognizedOutput.line
            );
            this.tokens.push(partial);
          } else {
            this.errors.push({
              type: "Error",
              errorMsg: "Incomple " + recognizedOutput.subtype,
              value: recognizedOutput.value,
              line: recognizedOutput.line
            });
          }
        }
      } else {
        //Error and has no transition
        if (recognizedOutput.type == "Error") {
          this.errors.push(recognizedOutput);
        } else if (recognizedOutput.type == "Line Break") {
          this.line++;
        } else if (recognizedOutput.type == "Blank Space") {
        } else if (recognizedOutput.type == "Comment") {
          this.position--;
        } else {
          //Recognizes and has no trasition
          this.position--;
          this.tokens.push(recognizedOutput);
          this.currentLexeme = this.input.charAt(this.position - 1);
        }
        //Current lexeme becomes next token
        this.currentLexeme = this.input.charAt(this.position);
      }
      //Walk one position
    }

    if (this.errors.length > 0) {
      return this.errors;
    } else {
      return this.tokens;
    }
  }

  recognize(lexeme) {
    const reco = new Reconizer([
      "class",
      "const",
      "variables",
      "method",
      "return",
      "main",
      "if",
      "then",
      "else",
      "while",
      "read",
      "write",
      "void",
      "int",
      "float",
      "bool",
      "string",
      "true",
      "false",
      "extends"
    ]);
    if (reco.isDigit(lexeme.charAt(0)) || lexeme.charAt(0) == "-") {
      return this.recognizeNumber(lexeme, this.line, reco);
      //Identifier
    } else if (lexeme.charAt(0) == '"') {
      return this.reconizeString(lexeme, this.line, reco);
    } else if (reco.isLetter(lexeme.charAt(0))) {
      return this.reconizeWord(lexeme, this.line, reco);
      //String
    } else if (lexeme.charAt(0) == "\n" || lexeme.charAt(0) == "\r") {
      return {
        type: "Line Break",
        value: lexeme,
        line: this.line
      };
    } else if (/\s/.test(lexeme.charAt(0))) {
      return {
        type: "Blank Space",
        value: lexeme,
        line: this.line
      };
    } else if (reco.isSymbol(lexeme.charAt(0))) {
      return this.recognizeSymbol(lexeme, this.line, reco);
    }
    return {
      type: "Error",
      errorMsg: "Invalid symbol",
      value: lexeme,
      line: this.line
    };
  }

  recognizeNumber(lexeme, line, reco) {
    const output = reco.isNumber.runInput(lexeme);
    if (output.hasTransition == false && output.isFinal == true) {
      //Trata excessão '--' = número final
      if (lexeme.substring(0, lexeme.length - 1) == "--") {
        return new Token(
          "Arithmetic Operator",
          lexeme.substring(0, lexeme.length - 1),
          this.line
        );
      }
      return new Token(
        "Number",
        lexeme.substring(0, lexeme.length - 1),
        this.line
      );
    } else if (output.hasTransition == false && output.isFinal == false) {
      //Trata excessão '-' = número mal formado
      if (lexeme.charAt(1) == "-" && lexeme.length == 2) {
        return new Token(
          "Arithmetic Operator",
          lexeme.substring(0, lexeme.length - 1),
          this.line
        );
      }
      return {
        type: "Error",
        errorMsg: "Bad number",
        value: lexeme,
        line: this.line
      };
    } else if (output.hasTransition == true) {
      if (lexeme == "-" || lexeme == "--") {
        return {
          type: "Partial",
          subtype: "Arithmetic Operator",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
      return {
        type: "Partial",
        subtype: "Number",
        value: lexeme,
        isFinal: output.isFinal,
        line
      };
    }
  }

  reconizeWord(lexeme, line, reco) {
    const output = reco.isIdentifier.runInput(lexeme);
    if (output.hasTransition == false && output.isFinal == true) {
      if (reco.isReservedWord(lexeme.substring(0, lexeme.length - 1))) {
        return new Token(
          "Reserved Word",
          lexeme.substring(0, lexeme.length - 1),
          this.line
        );
      }
      return new Token(
        "Identifier",
        lexeme.substring(0, lexeme.length - 1),
        this.line
      );
    } else if (output.hasTransition == false && output.isFinal == false) {
      return {
        type: "Error",
        errorMsg: "Bad identifier",
        value: lexeme,
        line: this.line
      };
    } else if (output.hasTransition == true) {
      if (reco.isReservedWord(lexeme)) {
        return {
          type: "Partial",
          subtype: "Reserved Word",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
      return {
        type: "Partial",
        subtype: "Identifier",
        value: lexeme,
        isFinal: output.isFinal,
        line
      };
    }
  }

  reconizeString(lexeme, line, reco) {
    const output = reco.isString.runInput(lexeme);
    if (output.hasTransition == false && output.isFinal == true) {
      return new Token("String", lexeme.substring(0, lexeme.length - 1), line);
    } else if (output.hasTransition == false && output.isFinal == false) {
      return {
        type: "Error",
        errorMsg: "Bad String",
        value: lexeme,
        line
      };
    } else if (output.hasTransition == true) {
      return {
        type: "Partial",
        subtype: "String",
        value: lexeme,
        isFinal: output.isFinal,
        line
      };
    }
  }

  recognizeSymbol(lexeme, line, reco) {
    let output = null;
    if (lexeme.charAt(0) == "/") {
      output = reco.commentOrDivision.runInput(lexeme);
      if (output.hasTransition == false && output.isFinal == true) {
        if (lexeme.charAt(1) != "*" && lexeme.charAt(1) != "/") {
          return new Token(
            "Arithmetic Operator",
            lexeme.substring(0, lexeme.length - 1),
            line
          );
        }
        return {
          type: "Comment",
          value: lexeme.substring(0, lexeme.length - 1),
          line
        };
      } else if (output.hasTransition == false && output.isFinal == false) {
        return {
          type: "Error",
          errorMsg: "Bad comment",
          value: lexeme,
          line
        };
      } else if (output.hasTransition == true) {
        if (lexeme == "/") {
          return {
            type: "Partial",
            subtype: "Aritmetic Operator",
            value: lexeme,
            isFinal: output.isFinal,
            line
          };
        }
        return {
          type: "Partial",
          subtype: "Comment",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
    } else if (lexeme.charAt(0) == "+" || lexeme.charAt(0) == "*") {
      output = reco.isArithmeticOperator.runInput(lexeme);
      if (output.hasTransition == false && output.isFinal == true) {
        return new Token(
          "Arithmetic Operator",
          lexeme.substring(0, lexeme.length - 1),
          line
        );
      } else if (output.hasTransition == false && output.isFinal == false) {
        return {
          type: "Error",
          errorMsg: "Bad operator",
          value: lexeme,
          line
        };
      } else if (output.hasTransition == true) {
        return {
          type: "Partial",
          subtype: "Arithmetic Operator",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
    } else if (
      lexeme.charAt(0) == "!" ||
      lexeme.charAt(0) == "=" ||
      lexeme.charAt(0) == "<" ||
      lexeme.charAt(0) == ">"
    ) {
      output = reco.relationalOrDifferent.runInput(lexeme);
      if (output.hasTransition == false && output.isFinal == true) {
        if (lexeme.charAt(0) == "!" && lexeme.length == 2) {
          return new Token(
            "Logic Operator",
            lexeme.substring(0, lexeme.length - 1),
            line
          );
        }
        return new Token(
          "Relational Operator",
          lexeme.substring(0, lexeme.length - 1),
          line
        );
      } else if (output.hasTransition == false && output.isFinal == false) {
        return {
          type: "Error",
          errorMsg: "Bad operator",
          value: lexeme,
          line
        };
      } else if (output.hasTransition == true) {
        if (lexeme == "!") {
          return {
            type: "Partial",
            subtype: "Logic Operator",
            value: lexeme,
            isFinal: output.isFinal,
            line
          };
        }
        return {
          type: "Partial",
          subType: "Relational Operator",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
    } else if (lexeme.charAt(0) == "&" || lexeme.charAt(0) == "|") {
      output = reco.logicOperator.runInput(lexeme);
      if (output.hasTransition == false && output.isFinal == true) {
        return new Token(
          "Logic Operator",
          lexeme.substring(0, lexeme.length - 1),
          line
        );
      } else if (output.hasTransition == false && output.isFinal == false) {
        return {
          type: "Error",
          errorMsg: "Bad operator",
          value: lexeme,
          line
        };
      } else if (output.hasTransition == true) {
        return {
          type: "Partial",
          subType: "Logic Operator",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
    } else if (
      lexeme.charAt(0) == ";" ||
      lexeme.charAt(0) == "." ||
      lexeme.charAt(0) == ")" ||
      lexeme.charAt(0) == "(" ||
      lexeme.charAt(0) == "," ||
      lexeme.charAt(0) == "]" ||
      lexeme.charAt(0) == "[" ||
      lexeme.charAt(0) == "{" ||
      lexeme.charAt(0) == "}"
    ) {
      output = reco.delimiter.runInput(lexeme);
      if (output.hasTransition == false && output.isFinal == true) {
        return new Token(
          "Delimiter",
          lexeme.substring(0, lexeme.length - 1),
          line
        );
      } else if (output.hasTransition == false && output.isFinal == false) {
        return {
          type: "Error",
          errorMsg: "Bad delimiter",
          value: lexeme,
          line
        };
      } else if (output.hasTransition == true) {
        return {
          type: "Partial",
          subType: "Delimiter",
          value: lexeme,
          isFinal: output.isFinal,
          line
        };
      }
    } else {
      return {
        type: "Error",
        errorMsg: "Invalid symbol",
        value: lexeme,
        line
      };
    }
  }
};
