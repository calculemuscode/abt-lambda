import { toString } from "./stringify";
import { parse } from "./parse";
import * as callByName from "./bigstep-cbn";
export { toString, parse, callByName };

export function evaluate(s: string): string {
    const [fv, e] = parse(s);
    const v = callByName.normalize(900, fv, e)[1];
    return toString(v);
}
