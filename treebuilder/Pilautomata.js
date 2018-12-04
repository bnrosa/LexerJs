module.exports = class Pilautomata {
  constructor(initialState, states, finalStates, nextState) {
    this.initialState = initialState;
    this.states = states;
    this.finalStates = finalStates;
    this.nextState = nextState;
    this.pile = [];
  }

  /**
   * Boilerplat method never actually used
   * @param {*} currentState
   * @param {*} input
   */
  nextState(currentState, input, pushPile) {
    switch (currentState) {
      case state1:
        switch (input) {
          case inputExample:
            switch (pullPile) {
              case pullPileExample:
            }
        }
    }
    return NoNextState;
  }

  runInput(input) {
    const NoNextState = "NoNextState";
    let currentState = this.initialState;
    const inputArr = input.split("");
    let recognized = "";
    let hasTransition = false;
    for (let i = 0; i < inputArr.length; i++) {
      if (this.nextState(currentState, inputArr[i]) == NoNextState) {
        hasTransition = false;
        break;
      } else {
        currentState = this.nextState(currentState, inputArr[i]);
        recognized = recognized.concat(inputArr[i]);
        hasTransition = true;
      }
    }
    return {
      isFinal: this.finalStates.some(e => e == currentState),
      hasTransition,
      recognized
    };
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
