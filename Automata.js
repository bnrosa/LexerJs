module.exports = class Automata {
  constructor(initialState, states, finalStates, nextState) {
    this.initialState = initialState;
    this.states = states;
    this.finalStates = finalStates;
    this.nextState = nextState;
  }

  /**
   * Boilerplat method never actually used
   * @param {*} currentState
   * @param {*} input
   */
  nextState(currentState, input) {
    switch (currentState) {
      case example:
        switch (input) {
          case example:
        }
    }
    return NoNextState;
  }

  runInput(input) {
    const NoNextState = "NoNextState";
    let currentState = this.initialState;
    const inputArr = input.split("");
    let recognized = "";
    for (let i = 0; i < inputArr.length; i++) {
      currentState = this.nextState(currentState, inputArr[i]);
      if (currentState == NoNextState) {
        break;
      } else {
        recognized = recognized.concat(inputArr[i]);
      }
    }
    return {
      validation: this.finalStates.some(e => e == currentState),
      currentState,
      recognized
    };
  }
};
