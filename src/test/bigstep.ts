import { parse, evaluate } from "../index";
import { expect, use } from "chai";
import { abt } from "@calculemus/abt";
import "mocha";

use((chai, utils) => {
    // The use of function (s) here is important; we're using the `this` argumet inside the function to get
    // the context of the calling function. Never seen this kind of usage before, not sure I like it.
    utils.addMethod(chai.Assertion.prototype, 'aequiv', function (s: string) {
        const actual = this._obj instanceof Function ? this._obj() : this._obj;
        const [fv1, actualNormalForm] = parse(actual);
        const [fv2, expectedNormalForm] = parse(s);
        this.assert(
            fv1.equals(fv2) && abt.equal(fv1, actualNormalForm, expectedNormalForm),
            `expected ${actual} and ${s} to be alpha equivalent`,
            `expected ${actual} and ${s} to not be alpha equivalent`,
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
