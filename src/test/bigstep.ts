import { parseExp, evaluate } from "../index";
import { expect, use } from "chai";
import { abt } from "@calculemus/abt";
import "mocha";

use((chai, utils) => {
    // The use of function (s) here is important; we're using the `this` argument inside the function to get
    // the calling context's `this`. Don't think I like it, to be honest; also can't find within Chai what
    // type to give to this.
    //
    // The explicit this parameter is so that we can keep noImplicitAny checked.
    // Documented at https://github.com/Microsoft/TypeScript/issues/3694
    utils.addMethod(chai.Assertion.prototype, 'aequiv', function (this: any, s: string) {
        const actualStr = this._obj instanceof Function ? this._obj() : this._obj;
        const actual = parseExp(actualStr);
        const expected = parseExp(s);
        this.assert(
            actual.fv.equals(expected.fv) && abt.equal(actual.fv, actual.exp, expected.exp),
            `expected ${actualStr} and ${s} to be alpha equivalent`,
            `expected ${actualStr} and ${s} to not be alpha equivalent`,
            s,
            actual
        );
    });
});

function expectEval(s: string) {
    return expect(() => evaluate(s), s);
}

describe("Big step evaluation", () => {
    it("Should correctly evaluate expressions returning constants", () => {
        expectEval("(x => x) y").to.be.aequiv("y");
        expectEval("(x => x) y").to.not.be.aequiv("z");
        expectEval("(x => x) y").to.not.be.aequiv("y y");
        expectEval("(x => y) x").to.be.aequiv("y");
        expectEval("(x => x => x) y z").to.be.aequiv("z");
        expectEval("(x => (y => y) x) w").to.be.aequiv("w");
    });

    it("Should evaluate under binders", () => {
        expectEval("x => (y => y) x").to.be.aequiv("z => z");
        expectEval("(z => x ((y => y) z) z) z").to.be.aequiv("x z z");
    });

    it("Should fail on an exception for nonterminating expressions", () => {
        expectEval("(x => x x)(x => x x)").to.throw();
        expectEval("((x => x x)(x => x x))x").to.throw();
    });
});
