const Automata = require("./Automata");

module.exports = class Recognizer {
  constructor() {
    const q0 = "q0";
    const q1 = "q1";
    const q2 = "q2";
    const q3 = "q3";
    const q4 = "q4";
    const q5 = "q5";
    const q6 = "q6";
    const NoNextState = "NoNextState";
    this.isString = new Automata(
      q0,
      [q0, q1, q2, q3, q4, q5, q6],
      [q6],
      function(currentState, input) {
        switch (currentState) {
          case q0:
            switch (input) {
              case "s":
                return q1;
            }
            break;
          case q1:
            switch (input) {
              case "t":
                return q2;
            }
            break;
          case q2:
            switch (input) {
              case "r":
                return q3;
            }
            break;
          case q3:
            switch (input) {
              case "i":
                return q4;
            }
            break;
          case q4:
            switch (input) {
              case "n":
                return q5;
            }
            break;
          case q5:
            switch (input) {
              case "g":
                return q6;
            }
            break;
        }
        return NoNextState;
      }
    );

    this.isTrue = new Automata(q0, [q0, q1, q2, q3, q4], [q4], function(
      currentState,
      input
    ) {
      switch (currentState) {
        case q0:
          switch (input) {
            case "t":
              return q1;
          }
          break;
        case q1:
          switch (input) {
            case "r":
              return q2;
          }
          break;
        case q2:
          switch (input) {
            case "u":
              return q3;
          }
          break;
        case q3:
          switch (input) {
            case "e":
              return q4;
          }
          break;
      }
      return NoNextState;
    });
  }
};
