const grammar = require("./grammar");
module.exports = class Rules {
  constructor() {
    this.rules = grammar;
    // this.initializeRules();
    // this.getFirstAll();
    // this.getFollowAll();
    this.completeTable();
  }

  getFirst(rule) {
    if (!this.isNonTerminal(rule)) {
      return [rule];
    }
    if (rule.first != undefined) {
      return rule.first;
    }
    let index = this.rules.findIndex(e => e.left == rule);
    return this.rules[index].first;
  }

  // getFirstRight(production) {
  //   //production is the rule itself, the array of productions
  //   let firsts = [];

  //   for (let unity of production) {
  //     if (this.rules.some(e => e.left == unity)) {
  //       let index = this.rules.findIndex(e => e.left == unity);
  //       let targetRule = this.rules[index];
  //       let targetFirsts = targetRule.first;
  //       for (let firstsOfTarget of targetFirsts) {
  //         if (!firsts.some(e => e != firstsOfTarget)) {
  //           firsts.push(firstsOfTarget);
  //         }
  //       }
  //       if (!targetRule.right.some(e => e == "ε")) {
  //         break;
  //       }
  //     } else {
  //       if (!firsts.some(e => e == unity)) {
  //         firsts.push(unity);
  //         break;
  //       }
  //     }
  //   }
  //   console.log(firsts);
  //   return firsts;
  // }

  getRightFirsts(productionSet) {
    let firsts = [];
    let shouldBreak;
    for (let prod of productionSet) {
      shouldBreak = true;
      if (this.isNonTerminal(prod)) {
        let index = this.rules.findIndex(e => e.left == prod);
        let target = this.rules[index];
        for (let first of target.first) {
          if (!firsts.some(e => e == first)) {
            firsts.push(first);
          }
        }
        for (let targetPS of target.right) {
          if (targetPS.some(e => e == "ε")) {
            shouldBreak = false;
          }
        }
      }
      //For terminals
      else {
        if (!firsts.some(e => e == prod)) {
          firsts.push(prod);
        }
        break;
      }
    }
    return firsts;
  }

  addErrorHandling(predTable) {
    for (let rule of this.rules) {
      for (let followUnit of rule.follow) {
        predTable.push({
          nonTerminal: rule.left,
          terminal: followUnit,
          production: "sync",
          type: "error"
        });
      }
    }
    return predTable;
  }

  /**
   *
   */
  completeTable() {
    let predTable = [];
    for (let rule of this.rules) {
      for (let prod of rule.right) {
        if (prod.some(e => e == "ε")) {
          let follow = rule.follow;
          for (let value of follow) {
            predTable.push({
              nonTerminal: rule.left,
              terminal: value,
              production: prod,
              type: "normal"
            });
          }
        }
        //If production isnt empty
        else {
          let firsts = this.getRightFirsts2(prod);
          for (let value of firsts) {
            if (value == "ε") {
              let follow = rule.follow;
              for (let fl of follow) {
                predTable.push({
                  nonTerminal: rule.left,
                  terminal: fl,
                  production: prod,
                  type: "normal"
                });
              }
            } else {
              predTable.push({
                nonTerminal: rule.left,
                terminal: value,
                production: prod,
                type: "normal"
              });
            }
          }
        }
      }
    }
    predTable = this.addErrorHandling(predTable);
    return predTable;
  }

  getRightFirsts2(prod) {
    if (this.rules.some(e => e.left == prod[0])) {
      let index = this.rules.findIndex(e => e.left == prod[0]);
      return this.rules[index].first;
    }
    //Terminal
    else {
      return [prod[0]];
    }
  }

  // completeTable2(){
  //   let predTable = []
  //   for(rule of this.rules){
  //     for(first of rule.first){

  //     }
  //   }
  // }

  isNonTerminal(target) {
    if (target.left == undefined) {
      return this.rules.some(e => e.left == target);
    } else {
      return this.rules.some(e => e.left == target.left);
    }
  }

  indirectProduction(rule, masterRule, next) {
    //console.log("rule: " + rule.left + " masterRule: " + rule.left);
    for (let targetRule of this.rules) {
      if (targetRule.left != rule.left) {
        for (let productionSet of targetRule.right) {
          if (productionSet.some(e => e == rule.left)) {
            let index = productionSet.findIndex(e => e == rule.left);
            if (productionSet[index + 1] == undefined) {
              if (next == true && masterRule.left == targetRule.left) {
                return true;
              }
              return this.indirectProduction(targetRule, masterRule, true);
            }
          }
        }
      }
    }
    //console.log("Error at: " + rule.left);
    return false;
  }

  indirectProduction2(rule) {
    //console.log("rule: " + rule.left + " masterRule: " + rule.left);
    const master = rule.left;
    let currentRule = rule.left;
    let target = null;
    for (let i = 0; i < this.rules.length; i++) {
      for (let productionSet of this.rules[i].right) {
        if (productionSet.some(e => e == currentRule)) {
          let index = productionSet.findIndex(e => e == currentRule);
          if (productionSet[index + 1] == undefined) {
            target = this.rules[i].left;
            currentRule = target;
            if (target == master) {
              return true;
            } else {
              i = 0;
              break;
            }
          }
        }
      }
    }
    //console.log("Error at: " + rule.left);
    return false;
  }
};
