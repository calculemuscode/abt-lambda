import { parse, toString } from "../index";
import { expect } from "chai";
import "mocha";

function expectParseToString(s: string) {
    const e = parse(s)[1];
    return expect(toString(e), s);
}

describe("Parsing", () => {
    it("Should reject bad inputs", () => {
        expect(() => parse("a =>")).to.throw();
        expect(() => parse("=> a")).to.throw();
    });
});

describe("The toString function", () => {
    it("Should be the inverse of parse if there is no shadowing", () => {
        expectParseToString("x => x").to.equal("x => x");
        expectParseToString("x => y => y").to.equal("x => y => y");
        expectParseToString("x => x y x").to.equal("x => x y x");
        expectParseToString("my dog has fleas").to.equal("my dog has fleas");
        expectParseToString("a dark (and stormy) night").to.equal("a dark (and stormy) night");
        expectParseToString("(a => b) c").to.equal("(a => b) c");
    });

    it("Should omit unnecessary parentheses", () => {
        expectParseToString("((((a) (b => c))) (d => e))").to.equal("a (b => c) (d => e)");
    });

    it("Should correctly handle shadowing", () => {
        expectParseToString("(x => x) x").to.equal("(x1 => x1) x");
    });
});

