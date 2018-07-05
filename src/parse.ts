import { Parser, Grammar } from "nearley";
import { ABT, abt } from "@calculemus/abt";
import { Set } from "immutable";
const rules = require("../lib/rules");

function parseSyn(syn: any): [Set<string>, ABT] {
    switch (syn["type"]) {
        case "ident": {
            return [Set([syn.text]), syn.text];
        }
        case "app": {
            const [fv1, s1] = parseSyn(syn.value[0]);
            const [fv2, s2] = parseSyn(syn.value[1]);
            return [fv1.union(fv2), abt.oper("Ap", s1, s2)];
        }
        case "fn": {
            const x = syn.value[0].text;
            const [fv0, s0] = parseSyn(syn.value[1]);
            return [fv0.delete(x), abt.oper("Fn", [[x], s0])];
        } /* istanbul ignore next */
        default:
            console.log(syn.tag);
            console.log(syn);
            throw new Error("Impossible");
    }
}

export function parse(s: string): {tag: "incomplete"} | { tag: "assign", id: string, fv: Set<string>, exp: ABT } | { tag: "value", fv: Set<string>, exp: ABT } | { tag: "error", msg: string } {
    const parser = new Parser(Grammar.fromCompiled(rules));
    try {
    parser.feed(s);
    const concrete = parser.finish();
    if (concrete.length < 1) return {tag: "incomplete"};
    /* istanbul ignore next */
    if (concrete.length > 1) throw new Error("Ambiguous parse (should be impossible)");
    const decl = concrete[0];
    if (decl["type"] === "assign") {
        const id = decl.value[0];
        const [fv, exp] = parseSyn(decl.value[2]);
        return { tag: "assign", id: id.value, fv: fv, exp: exp };
    } else {
        const [fv, exp] = parseSyn(decl);
        return { tag: "value", fv: fv, exp: exp };
    }
} catch (e) {
    return {tag: "error", msg: `${e}`}
}
}

export function parseExp(s: string): {fv: Set<string>, exp: ABT} {
    const parsed = parse(s);
    if (parsed.tag === "incomplete") { 
        throw new Error("Incomplete parse");
    } 
    else if (parsed.tag === "error") {
        throw new Error(parsed.msg)
    } else if (parsed.tag === "assign") {
        throw new Error("Expected a parsed expression, not an assignment")
    } else {
        return {fv: parsed.fv, exp: parsed.exp};
    }

}