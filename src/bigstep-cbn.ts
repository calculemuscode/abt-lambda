import { ABT, abt } from "@calculemus/abt";
import { Set } from "immutable";
import { toString } from "./stringify";

export function weakheadnormalize(gas: number, fv: Set<string>, e: ABT): [number, ABT] {
    if (gas === 0) throw new Error("Out of gas");
    if (typeof e === "string") return [gas, e];
    switch (e.tag) {
        case "Fn": {
            return [gas, e];
        }
        case "Ap": {
            const [[[], e1], [[], e2]] = abt.args(fv, e);
            const [gas1, norm1] = weakheadnormalize(gas, fv, e1);
            if (typeof norm1 === "string" || norm1.tag !== "Fn") {
                return [gas1, abt.oper("Ap", norm1, e2)];
            } else {
                const [[[x], e0]] = abt.args(fv, norm1);
                return weakheadnormalize(gas1 - 1, fv, abt.subst(fv, e2, x, e0));
            }
        } /* istanbul ignore next */
        default:
            throw new Error("weakheadnormalize: no match");
    }
}

export function normalize(gas: number, fv: Set<string>, e: ABT): [number, ABT] {
    if (gas === 0) throw new Error("Out of gas");
    if (typeof e === "string") return [gas, e];
    switch (e.tag) {
        case "Fn": {
            const [[[x], e0]] = abt.args(fv, e);
            const [gas0, norm0] = normalize(gas, fv.add(x), e0);
            return [gas0, abt.oper("Fn", [[x], norm0])];
        }
        case "Ap": {
            const [[[], e1], [[], e2]] = abt.args(fv, e);
            const [gas1, wnorm1] = weakheadnormalize(gas, fv, e1);
            if (typeof wnorm1 === "string" || wnorm1.tag !== "Fn") {
                const [gas2, norm1] = normalize(gas1, fv, wnorm1);
                const [gas3, norm2] = normalize(gas2, fv, e2);
                return [gas3, abt.oper("Ap", norm1, norm2)];
            } else {
                const [[[x], e0]] = abt.args(fv, wnorm1);
                return normalize(gas1 - 1, fv, abt.subst(fv, e2, x, e0));
            }
        } /* istanbul ignore next */
        default:
            throw new Error("normalize: no match");
    }
}
