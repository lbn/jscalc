var u = require("underscore");
var calc = require("./calc.js");

console.log("4+7="+calc.evaluateRPN([4,7,"+"]));
console.log("4-7="+calc.evaluateRPN([4,7,"-"]));
console.log("4*7="+calc.evaluateRPN([4,7,"*"]));
console.log("4/7="+calc.evaluateRPN([4,7,"/"]));

console.log("\n 1 2 + 3 4 - *  ="+calc.evaluateRPN([[1,2,"+"],[3,4,"-"],"*"]));
