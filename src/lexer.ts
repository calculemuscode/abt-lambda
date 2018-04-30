import { compile, Lexer } from "moo";

export const lexer: Lexer = compile({
    space: { match: /[ \t\n`]+/, lineBreaks: true },
    ident: {
        match: /[a-zA-Z0-9_]+/,
        keywords: {
            keyword: []
        }
    },
    symb: {
        match: /[\-=><:,.]+/,
        keywords: { keyword: ["->", "=>", "=", ":", "."] }
    },
    lparen: "(",
    rparen: ")",
    lcurly: "{",
    rcurly: "}"
});

export const util = {
    select0: (d: any) => d[0],
    select1: (d: any) => d[1],
    select2: (d: any) => d[2],
    select3: (d: any) => d[3],
    select4: (d: any) => d[4],
    create: (s: any) => (d: any) => ({
        type: s,
        value: d.filter((e: any) => {
            if (!e) return false;
            if (e.type === "space") return false;
            if (e.type === "keyword") return false;
            return true;
        })
    })
};
