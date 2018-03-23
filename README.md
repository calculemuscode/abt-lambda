Lambda calculus
===============

[![npm version](https://badge.fury.io/js/%40calculemus%2Fabt-lambda.svg)](https://badge.fury.io/js/%40calculemus%2Fabt-lambda)
[![Build Status](https://travis-ci.org/calculemuscode/abt-lambda.svg?branch=master)](https://travis-ci.org/calculemuscode/abt-lambda)
[![Dependency Status](https://david-dm.org/calculemuscode/abt-lambda.svg)](https://david-dm.org/calculemuscode/abt-lambda)
[![Dev Dependency Status](https://david-dm.org/calculemuscode/abt-lambda/dev-status.svg)](https://david-dm.org/calculemuscode/abt-lambda?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/calculemuscode/abt-lambda/badge.svg?branch=master)](https://coveralls.io/github/calculemuscode/abt-lambda?branch=master)

Demonstration of the [@calculemus/abt](https://www.npmjs.com/package/@calculemus/abt) library.

Based on Peter Sestoft's [Demonstrating Lambda Calculus
Reduction](http://www.itu.dk/people/sestoft/papers/sestoft-lamreduce.pdf).

Using the evaluator
-------------------

You can try the following code over at [RunKit](https://npm.runkit.com/@calculemus/abt-lambda):

```javascript
const abtLambda = require("@calculemus/abt-lambda");

// Parse, evaluate, and print as different steps
const [fv, e] = abtLambda.parse("x (x => (x => x) y x)");
console.log(abtLambda.toString(e));
const [gas, norm] = abtLambda.callByName.normalize(100, fv, e);
console.log(abtLambda.toString(norm));

// Do all of that at once
console.log(abtLambda.evaluate("(x => y => x y) (y => x) z"));
```
