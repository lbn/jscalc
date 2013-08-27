var assert = require("assert");
var calc = require("../lib/calc.js");

describe("eval",function(){
    describe("basic",function(){
        it("'( 2 + 3 ) * 4' should be evaluated to 20",function(){
            assert.equal(20,calc.evaluateIN(["(",2,"+",3,")","*",4]));
        });
        it("'3 + 4 * 2 / ( 1 - 5 ) ^ 2' should be evaluated to 3.5",function(){
            assert.equal(3.5,
                calc.evaluateIN([3,"+",4,"*",2,"/","(",1,"-",5,")","^",2]));
        });
    });
});

