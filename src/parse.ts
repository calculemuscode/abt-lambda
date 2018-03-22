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
            throw new Error("Impossible");
    }
}

export function parse(s: string): [Set<string>, ABT] {
    const parser = new Parser(Grammar.fromCompiled(rules));
    parser.feed(s);
    const concrete = parser.finish();
    if (concrete.length < 1) throw new Error(`Could not parse ${s}`);
    /* istanbul ignore next */
    if (concrete.length > 1) throw new Error("Ambiguous parse (should be impossible)");
    return parseSyn(concrete[0]);
}
