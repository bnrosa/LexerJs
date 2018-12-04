const grammar = [
  //Global scope
  {
    left: "Start",
    right: [["Constant Declaration", "Class Declaration", "More Classes"]],
    follow: ["$"],
    first: ["const", "class"]
  },
  {
    left: "More Classes",
    right: [["Class Declaration", "More Classes"], ["ε"]],
    follow: ["$"],
    first: ["ε", "class"]
  },

  //Class declarations
  {
    left: "Class Declaration",
    right: [["class", "Class Identification"]],
    follow: ["class", "$"],
    first: ["class"]
  },
  {
    left: "Class Identification",
    right: [["identifier", "Class Heritage", "{", "Class Body", "}"]],
    follow: ["class", "$"],
    first: ["identifier"]
  },
  {
    left: "Class Heritage",
    right: [["extends", "identifier"], ["ε"]],
    follow: ["{"],
    first: ["extends", "ε"]
  },
  {
    left: "Class Body",
    right: [["Class Attributes", "Class Methods"]],
    follow: ["}"],
    first: ["variables", "method", "ε"]
  },
  {
    left: "Class Attributes",
    right: [["Variable Declaration"]],
    follow: ["method", "}"],
    first: ["variables", "ε"]
  },
  {
    left: "Class Methods",
    right: [["Method Declaration"], ["ε"]],
    follow: ["method", "}"],
    first: ["ε", "method"]
  },

  //Constant Declaration
  {
    left: "Constant Declaration",
    right: [["const", "{", "Constants", "}"], ["ε"]],
    follow: ["class"],
    first: ["const", "ε"]
  },
  {
    left: "Constants",
    right: [["type", "ConstAttribution", "More Constants"]],
    follow: ["}"],
    first: ["type"]
  },
  {
    left: "More Constants",
    right: [
      [",", "ConstAttribution", "More Constants"],
      [";", "New Declaration"]
    ],
    follow: ["}"],
    first: [",", ";"]
  },
  {
    left: "New Declaration",
    right: [["Constants"], ["ε"]],
    follow: ["}"],
    first: ["type", "ε"]
  },
  {
    left: "ConstAttribution",
    right: [["identifier", "=", "Value"]],
    follow: [",", ";"],
    first: ["identifier"]
  },
  {
    left: "Value",
    right: [["number"], ["true"], ["false"], ["cadeCaracters"]],
    follow: [",", ";"],
    first: ["number", "true", "false", "cadeCaracters"]
  },
  //Variables declaration
  {
    left: "Variable Declaration",
    right: [["variables", "{", "Variable", "}"], ["ε"]],
    follow: [
      "method",
      "}",
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--"
    ],
    first: ["variables", "ε"]
  },
  {
    left: "Variable",
    right: [["type", "Variable2"], ["identifier", "Variable2"]],
    follow: ["}"],
    first: ["type", "identifier"]
  },
  {
    left: "Variable2",
    right: [["Name", "More Variables"]],
    follow: ["}"],
    first: ["identifier", "type", "ε"]
  },
  {
    left: "More Variables",
    right: [["Variable"], ["ε"]],
    follow: ["}"],
    first: ["type", "identifider", "ε"]
  },
  {
    left: "Name",
    right: [["identifier", "Array Verification", "More Names"], ["ε"]],
    follow: ["type", "identifier", "}"],
    first: ["identifier", "ε"]
  },
  {
    left: "More Names",
    right: [[",", "Name"], [";"]],
    follow: ["type", "identifier", "}"],
    first: [",", ";"]
  },
  //Method declarations
  {
    left: "Method Declaration",
    right: [
      [
        "method",
        "type",
        "identifier",
        "(",
        "Parameter Declaration",
        ")",
        "{",
        "Variable Declaration",
        "Commands",
        "}",
        "More Methods"
      ]
    ],
    follow: ["}"],
    first: ["method"]
  },
  {
    left: "More Methods",
    right: [["Method Declaration"], ["ε"]],
    follow: ["}"],
    first: ["method", "ε"]
  },
  {
    left: "Parameter Declaration",
    right: [["Parameter Declaration2"], ["ε"]],
    follow: [")"],
    first: ["ε", "type", "identifier"]
  },
  {
    left: "Parameter Declaration2",
    right: [
      ["Type", "identifier", "Array Verification", "More Parameters"],
      ["ε"]
    ],
    follow: [")"],
    first: ["ε", "type", "identifier"]
  },
  {
    left: "Type",
    right: [["type"], ["identifier"]],
    follow: ["identifier"],
    first: ["type", "identifier"]
  },
  {
    left: "More Parameters",
    right: [[",", "Parameter Declaration2"], ["ε"]],
    follow: [")"],
    first: [",", "ε"]
  },
  {
    left: "Array Verification",
    right: [["[", "Array Index", "]", "Double Array"], ["ε"]],
    follow: [
      ",",
      ";",
      ")",
      ".",
      "=",
      "++",
      "--",
      "(",
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&"
    ],
    first: ["[", "ε"]
  },
  {
    left: "Double Array",
    right: [["[", "Array Index", "]"], ["ε"]],
    follow: [
      ",",
      ";",
      ")",
      ".",
      "=",
      "++",
      "--",
      "(",
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&"
    ],
    first: ["[", "ε"]
  },
  {
    left: "Array Index",
    right: [["Add Exp"]],
    follow: ["]"],
    first: [
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  {
    left: "Return",
    right: [["return", "Return1"]],
    follow: [";"],
    first: ["return"]
  },
  {
    left: "Return1",
    right: [["identifier", "Array Verification"], ["Value"]],
    follow: [";"],
    first: ["identifier", "number", "true", "false", "cadeCaracters"]
  },
  {
    left: "Commands",
    right: [
      ["If Statement", "Commands"],
      ["ε"],
      ["While Statement", "Commands"],
      ["Read Statement", "Commands"],
      ["Attribution", ";", "Commands"],
      ["Write Statement", "Commands"],
      ["Return", ";"]
    ],
    follow: ["}"],
    first: [
      "ε",
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--"
    ]
  },
  //If statement
  {
    left: "If Statement",
    right: [
      [
        "if",
        "(",
        "Expression",
        ")",
        "then",
        "{",
        "Commands",
        "}",
        "Else Statement"
      ]
    ],
    follow: [
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--",
      "}"
    ],
    first: ["if"]
  },
  {
    left: "Else Statement",
    right: [["else", "{", "Commands", "}"], ["ε"]],
    follow: [
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--",
      "}"
    ],
    first: ["else", "ε"]
  },
  //While loop structure
  {
    left: "While Statement",
    right: [["while", "(", "Expression", ")", "{", "Commands", "}"]],
    follow: [
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--",
      "}"
    ],
    first: ["while"]
  },
  //Attribution statement
  {
    left: "Attribution",
    right: [
      ["Increment", "identifier", "Array Verification", "Attr"],
      ["identifier", "Array Verification", "Attr", "Verif"]
    ],
    follow: [";"],
    first: ["identifier", "++", "--"]
  },
  {
    left: "Verif",
    right: [["Normal Attribution2"], ["Complement"]],
    follow: [";"],
    first: ["=", "++", "--", "("]
  },
  {
    left: "Increment",
    right: [["++"], ["--"]],
    follow: ["identifier", ";"],
    first: ["++", "--"]
  },
  {
    left: "Normal Attribution2",
    right: [["=", "Normal Attribution3"], ["Increment"]],
    follow: [";"],
    first: ["=", "++", "--"]
  },
  {
    left: "Normal Attribution3",
    right: [["Expression"], ["cadeCaracters"]],
    follow: [";"],
    first: [
      "cadeCaracters",
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "relationalOperator",
      "||",
      "&&",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  //Expresions
  {
    left: "Expression",
    right: [["Add Exp", "Relational Exp"]],
    follow: [")", ";", ","],
    first: [
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "relationalOperator",
      "||",
      "&&",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  {
    left: "Relational Exp",
    right: [["relationalOperator", "Add Exp", "Logical Exp"], ["Logical Exp"]],
    follow: [")", ";", ","],
    first: ["relationalOperator", "||", "&&", "ε"]
  },
  {
    left: "Logical Exp",
    right: [["||", "Expression"], ["&&", "Expression"], ["ε"]],
    follow: [")", ";", ","],
    first: ["||", "&&", "ε"]
  },
  {
    left: "Add Exp",
    right: [["Mult Exp", "D"]],
    follow: ["]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: [
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  {
    left: "D",
    right: [["+", "Add Exp"], ["-", "Add Exp"], ["ε"]],
    follow: ["]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: ["+", "-", "ε"]
  },
  {
    left: "Mult Exp",
    right: [["Neg Exp"], ["E"]],
    follow: ["+", "-", "]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: [
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  {
    left: "E",
    right: [["*", "Mult Exp"], ["/", "Mult Exp"], ["ε"]],
    follow: ["+", "-", "]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: ["*", "/", "ε"]
  },
  {
    left: "Neg Exp",
    right: [
      ["-", "Exp Value"],
      ["Exp Value", "G"],
      ["!", "Exp Value"],
      ["++", "Exp Value"],
      ["--", "Exp Value"]
    ],
    follow: ["+", "-", "]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: ["-", "!", "++", "--", "number", "(", "identifier", "true"]
  },
  {
    left: "G",
    right: [["--"], ["++"], ["ε"]],
    follow: ["+", "-", "]", "relationalOperator", "||", "&&", ")", ";", ","],
    first: ["--", "++", "ε"]
  },
  {
    left: "Exp Value",
    right: [
      ["number"],
      ["(", "Expression", ")"],
      ["identifier", "Array Verification", "Attr", "Param2"],
      ["true", "false"]
    ],
    follow: [
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&",
      ")",
      ";",
      ",",
      "++",
      "--"
    ],
    first: ["number", "(", "identifier", "true"]
  },
  //Method calls
  {
    left: "Param2",
    right: [["Complement"], ["ε"]],
    follow: [
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&",
      ")",
      ";",
      ",",
      "++",
      "--"
    ],
    first: ["ε", "("]
  },
  {
    left: "Complement",
    right: [["(", "Param", ")"]],
    follow: [
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&",
      ")",
      ";",
      ",",
      "++",
      "--"
    ],
    first: ["("]
  },
  {
    left: "Param",
    right: [
      ["ε"],
      ["Expression", "More Param"],
      ["cadeCaracters", "More Param"]
    ],
    follow: [")"],
    first: [
      "ε",
      "cadeCaracters",
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "relationalOperator",
      "||",
      "&&",
      ",",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  {
    left: "More Param",
    right: [[",", "Obrigatory Param"], ["ε"]],
    follow: [")"],
    first: [",", "ε"]
  },
  {
    left: "Obrigatory Param",
    right: [["Expression", "More Param"], ["cadeCaracters", "More Param"]],
    follow: [")"],
    first: [
      "cadeCaracters",
      "-",
      "!",
      "++",
      "--",
      "*",
      "/",
      "+",
      "relationalOperator",
      "||",
      "&&",
      ",",
      "ε",
      "number",
      "(",
      "identifier",
      "true"
    ]
  },
  //Read structure
  {
    left: "Read Statement",
    right: [["read", "(", "Reading1", ")", ";"]],
    follow: [
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--",
      "}"
    ],
    first: ["read"]
  },
  {
    left: "Reading1",
    right: [["identifier", "Array Verification", "Attr", "More Readings"]],
    follow: [")"],
    first: ["identifier"]
  },
  {
    left: "More Readings",
    right: [[",", "Reading1"], ["ε"]],
    follow: [")"],
    first: [",", "ε"]
  },
  //Write structure
  {
    left: "Write Statement",
    right: [["write", "(", "Writing1", ")", ";"]],
    follow: [
      "return",
      "if",
      "while",
      "read",
      "identifier",
      "write",
      "++",
      "--",
      "}"
    ],
    first: ["write"]
  },
  {
    left: "Writing1",
    right: [["identifier", "Array Verification", "Attr", "More Writings"]],
    follow: [")"],
    first: ["identifier"]
  },
  {
    left: "More Writings",
    right: [[",", "Writing1"], ["ε"]],
    follow: [")"],
    first: [",", "ε"]
  },
  {
    left: "Attr",
    right: [[".", "identifier", "Array Verification", "Attr"], ["ε"]],
    follow: [
      ";",
      "=",
      "++",
      "--",
      "(",
      "+",
      "-",
      "]",
      "relationalOperator",
      "||",
      "&&",
      ")",
      ","
    ],
    first: [".", "ε"]
  }
];

module.exports = grammar;
