const Automata = require("./Automata");

module.exports = class Recognizer {
  constructor(reservedWords) {
    const q0 = "q0";
    const q1 = "q1";
    const q2 = "q2";
    const q3 = "q3";
    const q4 = "q4";
    const q5 = "q5";
    const q6 = "q6";
    const q7 = "q7";
    const q8 = "q8";
    const q9 = "q9";
    const NoNextState = "NoNextState";

    this.reservedWords = reservedWords;

    /***
     * Trata números e os operadores '-' e '--'
     */
    this.isNumber = new Automata(
      q0,
      [q0, q1, q2, q3, q4, q5],
      [q2, q4, q5],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == "-") {
              return q1;
            }
            if (this.isDigit(input)) {
              return q2;
            }
            break;
          case q1:
            if (input == "-") {
              return q5;
            }
            if (this.isSpace(input)) {
              return q1;
            }
            if (this.isDigit(input)) {
              return q2;
            }
            break;
          case q2:
            if (this.isDigit(input)) {
              return q2;
            }
            if (input == ".") {
              return q3;
            }
            break;
          case q3:
            if (this.isDigit(input)) {
              return q4;
            }
            break;
          case q4:
            if (this.isDigit(input)) {
              return q4;
            }
            break;
        }
        return NoNextState;
      }
    );

    this.isIdentifier = new Automata(q0, [q0, q1], [q1], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          if (this.isLetter(input)) {
            return q1;
          }
          break;
        case q1:
          if (this.isLetter(input)) {
            return q1;
          }
          if (this.isDigit(input)) {
            return q1;
          }
          if (input == "_") {
            return q1;
          }
          break;
      }
      return NoNextState;
    });

    this.isString = new Automata(q0, [q0, q1, q2, q3], [q3], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          if (input == '"') {
            return q1;
          }
          break;
        case q1:
          if (input == '"') {
            return q3;
          } else if (input == "\\") {
            return q2;
          } else if (
            this.isDigit(input) ||
            this.isLetter(input) ||
            this.isSymbol(input)
          ) {
            return q1;
          }
          break;
        case q2:
          if (input == "\\") {
            return q2;
          } else if (
            this.isDigit(input) ||
            this.isLetter(input) ||
            this.isSymbol(input)
          ) {
            return q1;
          }
      }
      return NoNextState;
    });

    /***
     * Identifies arithmetic operators '*', '+', '++'
     */
    this.isArithmeticOperator = new Automata(
      q0,
      [q0, q1, q2, q3],
      [q1, q2, q3],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == "+") {
              return q1;
            }
            if (input == "*") {
              return q2;
            }
            break;
          case q1:
            if (input == "+") {
              return q3;
            }
            break;
        }
        return NoNextState;
      }
    );

    /***
     * Reconizes comments and the division arithmetic operator '/'
     */
    this.commentOrDivision = new Automata(
      q0,
      [q0, q1, q2, q3, q4, q5, q6],
      [q1, q3, q6],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == "/") {
              return q1;
            }
            break;
          case q1:
            if (input == "/") {
              return q2;
            } else if (input == "*") {
              return q4;
            }
            break;
          case q2:
            if (/\n/.test(input)) {
              return q3;
            } else {
              return q2;
            }
          case q4:
            if (input == "*") {
              return q5;
            } else {
              return q4;
            }
          case q5:
            if (input == "/") {
              return q6;
            } else {
              return q4;
            }
        }
        return NoNextState;
      }
    );

    /***
     * Reconizes relational operators and '!' logical operator
     */
    this.relationalOrDifferent = new Automata(
      q0,
      [q0, q1, q2, q3, q4, q5, q6, q7, q8],
      [q1, q2, q3, q4, q5, q6, q7, q8],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == "!") {
              return q1;
            }
            if (input == "=") {
              return q3;
            }
            if (input == "<") {
              return q5;
            }
            if (input == ">") {
              return q7;
            }
            break;
          case q1:
            if (input == "=") {
              return q2;
            }
            break;
          case q3:
            if (input == "=") {
              return q4;
            }
            break;
          case q5:
            if (input == "=") {
              return q6;
            }
            break;
          case q7:
            if (input == "=") {
              return q8;
            }
            break;
        }
        return NoNextState;
      }
    );

    this.logicOperator = new Automata(
      q0,
      [q0, q1, q2, q3, q4],
      [q4, q2],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == "&") {
              return q1;
            }
            if (input == "|") {
              return q3;
            }
            break;
          case q1:
            if (input == "&") {
              return q2;
            }
            break;
          case q3:
            if (input == "|") {
              return q4;
            }
            break;
        }
        return NoNextState;
      }
    );

    this.delimiter = new Automata(
      q0,
      [q0, q1, q2, q3, q4, q5, q6, q7, q8, 19],
      [q1, q2, q3, q4, q5, q6, q7, q8, q9],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            if (input == ";") {
              return q1;
            }
            if (input == ".") {
              return q2;
            }
            if (input == ",") {
              return q3;
            }
            if (input == "(") {
              return q4;
            }
            if (input == ")") {
              return q5;
            }
            if (input == "[") {
              return q6;
            }
            if (input == "]") {
              return q7;
            }
            if (input == "{") {
              return q8;
            }
            if (input == "}") {
              return q9;
            }
            break;
        }
        return NoNextState;
      }
    );
  }

  // isNumber(string) {
  //   let regexFull = /^-?(\s)*\d(\d)*(.\d(\d)*)?$/;
  //   let regex = /^-?(\s)*\d(\d)*(.\d(\d)*)?/;
  //   let validation = regexFull.test(string);
  //   let recognized = regex.exec(string);
  //   if (recognized == null) {
  //     return { validation, recognized };
  //   }
  //   return { validation, reconized: recognized[0] };
  // }

  // isIdentifier(string) {
  //   let regexFull = /^([a-z]|[A-Z])(\w)*$/;
  //   let regex = /^([a-z]|[A-Z])(\w)*/;
  //   let validation = regexFull.test(string);
  //   let recognized = regex.exec(string);
  //   if (recognized == null) {
  //     return { validation, recognized };
  //   }
  //   return { validation, reconized: recognized[0] };
  // }

  isReservedWord(string) {
    return this.reservedWords.some(e => e == string);
  }
  //Contém aspas duplas
  isSymbol(char) {
    if (
      /\s/.test(char) ||
      char == "!" ||
      char == '"' ||
      char == "$" ||
      char == "%" ||
      char == "&" ||
      char == "'" ||
      char == "(" ||
      char == ")" ||
      char == "*" ||
      char == "+" ||
      char == "," ||
      char == "-" ||
      char == "." ||
      char == "/" ||
      char == ":" ||
      char == ";" ||
      char == "<" ||
      char == "=" ||
      char == ">" ||
      char == "?" ||
      char == "@" ||
      char == "[" ||
      char == "]" ||
      char == "^" ||
      char == "_" ||
      char == "`" ||
      char == "{" ||
      char == "|" ||
      char == "}" ||
      char == "~"
    ) {
      return true;
    }
    return false;
  }
  isDigit(char) {
    let regex = /1|2|3|4|5|6|7|8|9|0/;
    return regex.test(char);
  }
  isLetter(char) {
    return /[a-z]|[A-Z]/.test(char);
  }
  isSpace(char) {
    return /\s/.test(char);
  }
};

// this.isString = new Automata(q0, [q0, q1, q2, q3, q4, q5, q6], [q6], function(
//   currentState,
//   input
// ) {
//   switch (currentState) {
//     case q0:
//       switch (input) {
//         case "s":
//           return q1;
//       }
//       break;
//     case q1:
//       switch (input) {
//         case "t":
//           return q2;
//       }
//       break;
//     case q2:
//       switch (input) {
//         case "r":
//           return q3;
//       }
//       break;
//     case q3:
//       switch (input) {
//         case "i":
//           return q4;
//       }
//       break;
//     case q4:
//       switch (input) {
//         case "n":
//           return q5;
//       }
//       break;
//     case q5:
//       switch (input) {
//         case "g":
//           return q6;
//       }
//       break;
//   }
//   return NoNextState;
// });

// this.isTrue = new Automata(q0, [q0, q1, q2, q3, q4], [q4], function(
//   currentState,
//   input
// ) {
//   switch (currentState) {
//     case q0:
//       switch (input) {
//         case "t":
//           return q1;
//       }
//       break;
//     case q1:
//       switch (input) {
//         case "r":
//           return q2;
//       }
//       break;
//     case q2:
//       switch (input) {
//         case "u":
//           return q3;
//       }
//       break;
//     case q3:
//       switch (input) {
//         case "e":
//           return q4;
//       }
//       break;
//   }
//   return NoNextState;
// });
