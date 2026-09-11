import { describe, expect, it } from "vitest";
import { scoreRepository } from "../src/engines/scoring.engine.js";

const evidence = (strength, occurrences = 1) => ({
  strength,
  occurrences,
  filePaths: { "src/example.js": occurrences },
  evidence: []
});

describe("role-card scoring contract", () => {
  it("returns a backend role only when its required evidence gates are met", () => {
    const results = scoreRepository({
      express_routing: evidence(3),
      database_management: evidence(3),
      testing: evidence(2)
    });

    expect(results[0]).toMatchObject({
      roleId: "backend_javascript_developer",
      title: "Backend JavaScript Developer"
    });
    expect(results[0].matchedSignals).toContainEqual(expect.objectContaining({
      signal: "express_routing",
      score: 15,
      strength: 3
    }));
  });

  it("does not let weak or missing evidence satisfy required capabilities", () => {
    const results = scoreRepository({
      express_routing: evidence(3),
      database_management: evidence(1, 100)
    });

    expect(results).toEqual([]);
  });

  it("does not increase weighted points when a capability appears repeatedly", () => {
    const once = scoreRepository({
      express_routing: evidence(3, 1),
      database_management: evidence(3, 1)
    })[0];
    const repeated = scoreRepository({
      express_routing: evidence(3, 100),
      database_management: evidence(3, 100)
    })[0];

    expect(repeated.rawScore).toBe(once.rawScore);
    expect(repeated.finalScore).toBe(once.finalScore);
  });
});
