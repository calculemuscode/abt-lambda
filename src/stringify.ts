import { ABT, abt } from "@calculemus/abt";
import { Set } from "immutable";

function toStringImpl(fv: Set<string>, lamParens: boolean, appParens: boolean, e: ABT): string {
    if (typeof e === "string") return e;
    switch (e.tag) {
        case "Ap": {
            const [[[], e1], [[], e2]] = abt.args(fv, e);
            const s = `${toStringImpl(fv, true, false, e1)} ${toStringImpl(fv, true, true, e2)}`;
            return appParens ? `(${s})` : `${s}`;
        }
        case "Fn": {
            const [[[x], e0]] = abt.args(fv, e);
            const s0 = toStringImpl(fv.add(x), false, false, e0);
            return lamParens ? `(${x} => ${s0})` : `${x} => ${s0}`;
        } /* istanbul ignore next */
        default:
            throw new Error("toStringImpl: impossible");
    }
}

export function toString(e: ABT): string {
    return toStringImpl(abt.freevars(e), false, false, e);
}
