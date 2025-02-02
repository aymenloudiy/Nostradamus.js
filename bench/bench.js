#!/usr/bin/env node

import Benchmark from "../node_modules/benchmark/benchmark.js";
import normal from "../lib/holt-winters.js";
import memo from "../lib/holt-winters-memoize.js";

const suite = new Benchmark.Suite();

const data = [
  362, 385, 432, 341, 382, 409, 498, 387, 473, 513, 582, 474, 544, 582, 681,
  557, 628, 707, 773, 592, 627, 725, 854, 661,
];
const alpha = 0.5;
const beta = 0.4;
const gamma = 0.6;
const period = 4;
const m = 4;

const memoed = memo({
  length: data.length,
  alpha: alpha,
  beta: beta,
  gamma: gamma,
  period: period,
  m: m,
});

// Add tests
suite
  .add("nostradamus-> normal", function () {
    return normal(data, alpha, beta, gamma, period, m);
  })
  .add("nostradamus-> memo", function () {
    return memoed(data);
  })

  // Add listeners
  .on("cycle", function (event) {
    console.log("\n" + String(event.target));
  })
  .on("complete", function () {
    console.log("\nFASTEST is " + this.filter("fastest").map("name") + "\n");
  })

  // Run async
  .run({ async: false });
