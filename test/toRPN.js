var assert = require("assert");
var calc = require("../calc.js");


describe("calc",function(){
    describe("basic",function(){
        it("'( 2 + 3 ) * 4' should be converted to '2 3 + 4 *'",function(){
            assert.deepEqual([2,3,"+",4,"*"],calc.toRPN(["(",2,"+",3,")","*",4]));
        });
        it("'3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3' should be converted to '3 4 2 * 1 5 - 2 3 ^ ^ / +'",function(){
            assert.deepEqual([3,4,2,"*",1,5,"-",2,3,"^","^","/","+"],
                calc.toRPN([3,"+",4,"*",2,"/","(",1,"-",5,")","^",2,"^",3]));
        });
    });

    describe("functions",function(){
        it("'sqrt ( 2 )' should be converted to '2 sqrt'",function(){
            assert.deepEqual([2,"sqrt"],calc.toRPN(["sqrt","(",2,")"]));
        });
        it("'sqrt ( 2 + 3 ^ 2 ) ^ 0.5 ' should be converted to '2 3 2 ^ + sqrt 0.5 ^'",function(){
            assert.deepEqual([2,3,2,"^","+","sqrt",0.5,"^"],calc.toRPN(["sqrt","(",2,"+",3,"^",2,")","^",0.5]));
        });
    });
});

