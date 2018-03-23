// This allows aequiv to be called in tests for bigstep.ts
// https://stackoverflow.com/questions/32452577/adding-chai-js-matchers-in-typescript

declare module Chai {
    interface Assertion {
        aequiv(s: string):Assertion;
    }
}
