import { toString } from "./stringify";
import { parse, parseExp } from "./parse";
import * as callByName from "./bigstep-cbn";
export { toString, parse, parseExp, callByName };

export function evaluate(s: string): string {
    const parsed = parse(s);
    if (parsed.tag === "incomplete") {
        throw new Error("Incomplete expression");
    } else if (parsed.tag === "error") {
        throw new Error(parsed.msg)
    } else {
        const output = callByName.normalize(900, parsed.fv, parsed.exp);
        return toString(output[1]);
    }
}
