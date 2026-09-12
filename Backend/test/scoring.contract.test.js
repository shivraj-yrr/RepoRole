import { describe, expect, it } from "vitest";
import { scoreRepository } from "../src/engines/scoring.engine.js";

const evidence = (strength, occurrences = 1) => ({
  strength,
  occurrences,
  filePaths: { "src/example.js": occurrences },
  evidence: []
});

describe("role-card scoring contract", () => {
  it("returns a backend role only when its essential and required evidence gates are met", () => {
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

  it("does not let weak evidence satisfy an essential (hard-gate) capability", () => {
    // express_routing is the backend role's essential anchor; strength 1 < required 3.
    const results = scoreRepository({
      express_routing: evidence(1, 100),
      database_management: evidence(3)
    });

    expect(results).toEqual([]);
  });

  it("keeps a role eligible when a non-essential required capability is missing but reduces its score", () => {
    const full = scoreRepository({
      express_routing: evidence(3),
      database_management: evidence(3)
    })[0];
    const partial = scoreRepository({
      express_routing: evidence(3)
    })[0];

    expect(partial.roleId).toBe("backend_javascript_developer");
    expect(partial.matchedSignals).not.toContainEqual(expect.objectContaining({ signal: "database_management" }));
    expect(full.matchedSignals).toContainEqual(expect.objectContaining({ signal: "database_management" }));
    expect(partial.finalScore).toBeLessThan(full.finalScore);
  });

  it("never reports a final score above 100 even with strong depth bonuses", () => {
    // Mirrors the original bug: frontend role with deep signals normalized to 66/65 => 101.54.
    const depth = { strength: 3, occurrences: 50, filePaths: { "a": 10, "b": 10, "c": 30 }, evidence: [] };
    const results = scoreRepository({
      state_management: depth,
      testing: depth,
      error_handling: depth
    });

    const frontend = results.find(role => role.roleId === "frontend_developer");
    expect(frontend).toBeTruthy();
    expect(frontend.finalScore).toBeLessThanOrEqual(100);
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

  it("returns up to three ranked roles, including backend, from strong backend + frontend signals", () => {
    const results = scoreRepository({
      express_routing: evidence(3),
      express_middleware: evidence(3),
      token_authentication: evidence(2),
      error_handling: evidence(2),
      testing: evidence(2),
      state_management: evidence(2)
    });

    expect(results.length).toBeGreaterThanOrEqual(2);
    const backendIds = ["backend_javascript_developer", "fullstack_javascript_developer"];
    expect(backendIds.some(id => results.some(role => role.roleId === id))).toBe(true);
    expect(results.every(role => role.rank >= 1 && role.rank <= 3)).toBe(true);
  });

  it("scopes error_handling and testing to the role's own side in a monorepo", () => {
    const structure = [
      "Backend/src/app.js",
      "Backend/routes/taskRoutes.js",
      "Backend/test/api.test.js",
      "Frontendrepo/src/App.jsx",
      "Frontendrepo/test/App.test.jsx"
    ];

    const mixed = {
      express_routing: {
        signal: "express_routing", occurrences: 2, strength: 3,
        filePaths: { "Backend/routes/taskRoutes.js": 2 },
        evidence: [
          { id: "x1", filePath: "Backend/routes/taskRoutes.js", strength: "strong" },
          { id: "x2", filePath: "Backend/routes/taskRoutes.js", strength: "strong" }
        ]
      },
      error_handling: {
        signal: "error_handling", occurrences: 4, strength: 2,
        filePaths: { "Backend/src/app.js": 2, "Frontendrepo/src/App.jsx": 2 },
        evidence: [
          { id: "e1", filePath: "Backend/src/app.js", strength: "strong" },
          { id: "e2", filePath: "Backend/src/app.js", strength: "strong" },
          { id: "e3", filePath: "Frontendrepo/src/App.jsx", strength: "strong" },
          { id: "e4", filePath: "Frontendrepo/src/App.jsx", strength: "strong" }
        ]
      },
      testing: {
        signal: "testing", occurrences: 2, strength: 2,
        filePaths: { "Backend/test/api.test.js": 2 },
        evidence: [
          { id: "t1", filePath: "Backend/test/api.test.js", strength: "strong" },
          { id: "t2", filePath: "Backend/test/api.test.js", strength: "strong" }
        ]
      },
      state_management: {
        signal: "state_management", occurrences: 2, strength: 2,
        filePaths: { "Frontendrepo/src/App.jsx": 2 },
        evidence: [
          { id: "s1", filePath: "Frontendrepo/src/App.jsx", strength: "strong" },
          { id: "s2", filePath: "Frontendrepo/src/App.jsx", strength: "strong" }
        ]
      }
    };

    const results = scoreRepository(mixed, false, structure);

    const frontend = results.find(role => role.roleId === "frontend_developer");
    expect(frontend).toBeTruthy();
    const feErrorHandling = frontend.matchedSignals.find(match => match.signal === "error_handling");
    expect(feErrorHandling).toBeTruthy();
    expect(feErrorHandling.occurrences).toBe(2);
    expect(feErrorHandling.filePaths).toEqual({ "Frontendrepo/src/App.jsx": 2 });
    // Backend tests must not count toward the frontend role's testing signal.
    expect(frontend.matchedSignals.some(match => match.signal === "testing")).toBe(false);

    const backend = results.find(role => role.roleId === "backend_javascript_developer");
    expect(backend).toBeTruthy();
    const beTesting = backend.matchedSignals.find(match => match.signal === "testing");
    expect(beTesting).toBeTruthy();
    expect(beTesting.filePaths).toEqual({ "Backend/test/api.test.js": 2 });
    // Frontend state management must not leak into the backend role.
    expect(backend.matchedSignals.some(match => match.signal === "state_management")).toBe(false);
  });
});
