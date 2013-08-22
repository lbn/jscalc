var assert = require("assert");
var calc = require("../calc.js");


describe("calc",function(){
    describe("basic",function(){
        it("'2 2 +' should be converted to '[2,2,'+']'",function(){
            assert.deepEqual([2,2,"+"],calc.structRPN([2,2,"+"]));
        });
        it("'2 2 + 3 *' should be converted to '[[2,2,'+'],3,'*']'",function(){
            assert.deepEqual([3,[2,2,"+"],"*"],calc.structRPN([2,2,"+",3,"*"]));
        });
    });

    describe("functions",function(){
        var input = [2,2,"+","sqrt"];
        var output = [[2,2,"+"],"sqrt"];
        it("'"+JSON.stringify(input)+"'should be converted to '"+
            JSON.stringify(output)+"'",function(){
            assert.deepEqual(output,calc.structRPN(input));
        });

        var input2 = [9,2,2,"+","sqrt","-"];
        var output2 = [[[2,2,"+"],"sqrt"],9,"-"];
        it("'"+JSON.stringify(input2)+"'should be converted to '"+
            JSON.stringify(output2)+"'",function(){
            assert.deepEqual(output2,calc.structRPN(input2));
        });
    });
});

