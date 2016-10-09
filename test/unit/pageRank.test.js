const assert = require('assert');
const math = require('mathjs');
const solver = require('../../indexService/solver');

describe('Test Power Method', () => {
  // Test network and solution
  // http://www.mathworks.com/moler/exm/chapters/pagerank.pdf
  const M = math.matrix([
    [0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0]]);

  const ans = math.matrix([
    [0.3210],
    [0.1705],
    [0.1066],
    [0.1368],
    [0.0643],
    [0.2007]]);

  const adj = solver.normColumns(M, 1);
  const sol = solver.solver(adj, 0.85, 0.01);

  it('Convergence', () => {
    if (sol !== undefined) {
      assert.ok(true);
    } else {
      assert.ok(false);
    }
  });

  it('Accuracy', () => {
    if (solver.norm(math.subtract(sol, ans), 2) < 0.1) {
      assert.ok(true);
    } else {
      assert.ok(false);
    }
  });
});

