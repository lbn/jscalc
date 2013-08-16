var u;
if (typeof require != "undefined") {
    u = require("underscore"); 
} else { // not node.js
    exports = {};
}

var operators = exports.operators = [
{sign:"+",left_assoc:true,precedence:2,evaluate:function(expr,args){return expr(args[0])+expr(args[1])}},
{sign:"-",left_assoc:true,precedence:2,evaluate:function(expr,args){return expr(args[0])-expr(args[1])}},
{sign:"*",left_assoc:true,precedence:3,evaluate:function(expr,args){return expr(args[0])*expr(args[1])}},
{sign:"/",left_assoc:true,precedence:3,evaluate:function(expr,args){return expr(args[0])/expr(args[1])}}];


var functions = [
{name:"sin",args:1}
]
       
// Evaluate a structured RPN expression
var evaluateRPN_ = exports.evaluateRPN_ = function evaluateRPN_(args) {
    var s = args instanceof Array?u.last(args):[args];
    var myop = u.findWhere(operators,{sign:s});
    return myop?myop.evaluate(evaluateRPN_,args):args;
}

// Structure an RPN expression
var structRPN = exports.structRPN = function structRPN(args) {
    var rpn = function rpn(lst,op) {
        if (["+","-","*","/"].indexOf(op)!=-1) {
            return [[lst[1],lst[0],op]].concat(u.last(lst,lst.length-2)); }
        else {
            return [op].concat(lst);
        }
    }
    return u.reduce(args,rpn,[])[0];
}

var evaluateRPN = exports.evaluateRPN = function evaluateRPN(args) {
    // TODO: Error Checking
    return evaluateRPN_(structRPN(args));
}

var evaluateIN = exports.evaluateIN = function evaluateIN(args) {
    return evaluateRPN(toRPN(args));
}

var toRPN = exports.toRPN = function toRPN(args) {
    var output = [];
    var stack = [];

    var isOperator = function(token){
        return token && u.where(operators,{sign:token}).length>0};
    var isFunction = function(token){
        return token && u.where(functions,{sign:token}).length>0};
    for (var ti in args) {
        var token = args[ti];
        // Operator
        if (isOperator(token)) {
            var o1 = u.findWhere(operators,{sign:token});
            for (var i = stack.length-1; i >= 0; i--) {
                var o2 = u.findWhere(operators,{sign:stack[i]});
                if (!(o2 && ((o1.left_assoc && o1.precedence==o2.precedence)
                || o1.precedence<o2.precedence))) {
                    break;} else {
                    output.push(stack.pop());
                }
            }
            stack.push(token);
        // Number
        } else if (!isNaN(parseFloat(token)) && isFinite(token)) {
            output.push(token);
        } else if (token == "(" || isFunction(token)) {
            stack.push(token);
        } else if (token == ")") {
            for (var i=stack.length-1;i>=0;i--) {
                if (stack[i]=="(") {
                    stack.pop();
                    break;
                } else {
                    var ne = stack.pop();
                    output.push(ne);
                }
            }
            if (isFunction(u.last(stack))) {
                output.push(stack.pop());
            }
        }
    }
    for (var i = stack.length-1;i>=0;i--) {
        output.push(stack[i]);
    }
    return output;
}
