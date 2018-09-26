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
    const EOF = EOF;
    const NoNextState = "NoNextState";
    this.reservedWords = reservedWords;

    this.isNumber = new Automata(q0, [q0, q1, q2, q3, q4], [q2, q4], function(
      currentState,
      input
    ) {
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
    });

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
          if (input == "-") {
            return q1;
          }
          break;
      }
      return NoNextState;
    });

    this.isLineComment = new Automata(q0, [q0, q1, q2, q3], [q3], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          if (input == "/") {
            return q1;
          }
          break;
        case q1:
          if (input == "/") {
            return q2;
          }
          break;
        case q2:
          if (input == "\n" || input == EOF) {
            return q3;
          } else {
            return q2;
          }
      }
      return NoNextState;
    });

    this.isMultiComment = new Automata(q0, [q0, q1, q2, q3, q4], [q4], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          if (input == "/") {
            return q1;
          }
          break;
        case q1:
          if (input == "*") {
            return q2;
          }
          break;
        case q2:
          if (input == "*") {
            return q3;
          } else {
            return q2;
          }
        case q3:
          if (input == "/") {
            return q4;
          } else {
            return q2;
          }
      }
      return NoNextState;
    });

    this.isDelimiter = new Automata(q0, [q0, q1, q2, q3, q4], [q3], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          if (input == "/") {
            return q1;
          }
          break;
        case q1:
          if (input == "*") {
            return q2;
          }
          break;
        case q2:
          if (input == "*") {
            return q3;
          } else {
            return q2;
          }
        case q3:
          if (input == "/") {
            return q4;
          } else {
            return q2;
          }
      }
      return NoNextState;
    });
  }

  isNumber(string) {
    let regexFull = /^-?(\s)*\d(\d)*(.\d(\d)*)?$/;
    let regex = /^-?(\s)*\d(\d)*(.\d(\d)*)?/;
    let validation = regexFull.test(string);
    let recognized = regex.exec(string);
    if (recognized == null) {
      return { validation, recognized };
    }
    return { validation, reconized: recognized[0] };
  }

  isIdentifier(string) {
    let regexFull = /^([a-z]|[A-Z])(\w)*$/;
    let regex = /^([a-z]|[A-Z])(\w)*/;
    let validation = regexFull.test(string);
    let recognized = regex.exec(string);
    if (recognized == null) {
      return { validation, recognized };
    }
    return { validation, reconized: recognized[0] };
  }

  isSymbol(char) {
    let regex = new RegExp("!|\"|#|$|%|&|'|(|)|*|+|,|-|.|/|");
    return regex.test(char);
  }
  isDigit(char) {
    let regex = new RegExp("/\b/");
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
