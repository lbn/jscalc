var u;
if (typeof require != "undefined") {
    u = require("underscore"); 
} else { // not node.js
    exports = {};
}

var isOperator = function(token){
    return token && u.where(operators,{sign:token}).length>0};
var isFunction = function(token){
    return token && u.where(functions,{name:token}).length>0};

var operators = exports.operators = [
{sign:"+",left_assoc:true,precedence:2,args:2,evaluate:function(expr,args){return expr(args[0])+expr(args[1])}},
{sign:"-",left_assoc:true,precedence:2,args:2,evaluate:function(expr,args){return expr(args[0])-expr(args[1])}},
{sign:"*",left_assoc:true,precedence:3,args:2,evaluate:function(expr,args){return expr(args[0])*expr(args[1])}},
{sign:"/",left_assoc:true,precedence:3,args:2,evaluate:function(expr,args){return expr(args[0])/expr(args[1])}},
{sign:"^",left_assoc:false,precedence:4,args:2,evaluate:function(expr,args){return Math.pow(expr(args[0]),expr(args[1])); }}];


var functions = [
{name:"sqrt",args:1,evaluate:function(expr,args){return Math.sqrt(expr(args[0]))}}
]
       
// Evaluate a structured RPN expression
var evaluateRPN_ = exports.evaluateRPN_ = function evaluateRPN_(args) {
    var s = args instanceof Array?u.last(args):[args];
    var myop = u.findWhere(operators,{sign:s});
    var myfun = u.findWhere(functions,{name:s});
    if (myop) {
        return myop.evaluate(evaluateRPN_,args);
    } else if (myfun) {
        return myfun.evaluate(evaluateRPN_,args);
    } else {
        return args;
    }
}

// Structure an RPN expression
var structRPN = exports.structRPN = function structRPN(args) {
    var rpn = function rpn(lst,token) {
        var op = u.find(operators,function(op){return op.sign==token;});
        var fun = u.find(functions,function(fun){return fun.name==token;});
        if (op||fun) {
            var args = op?op.args:fun.args;
            return [u.first(lst,args).concat(token)].concat(u.last(lst,lst.length-args));
        } else {
            return [token].concat(lst);
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
