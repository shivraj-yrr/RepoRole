import { describe, expect, it } from "vitest";
import parser from "@babel/parser";
import { extractCodeSignals } from "../src/services/signal.service.js";
import { generalizeRoleSignals } from "../src/services/signal.normalizer.js";

function analyze(code, filePath = "src/example.js") {
  const ast = parser.parse(code, { sourceType: "module" });
  return generalizeRoleSignals(extractCodeSignals([{ path: filePath, ast }]));
}

describe("context-aware signal pipeline", () => {
  it("keeps generic CRUD as low-level evidence and does not claim database management", () => {
    const result = analyze("items.find(item => item.id === id);");

    expect(result.roleSignals.database_management).toBeUndefined();
    expect(result.detailedSignals["crud_operation:find"].evidence[0].strength).toBe("weak");
  });

  it("establishes database management only for a recognized client binding", () => {
    const result = analyze('import mongoose from "mongoose"; mongoose.find({ active: true });');
    const signal = result.roleSignals.database_management;

    expect(signal).toMatchObject({ signal: "database_management", strength: 3, occurrences: 1 });
    expect(signal.evidence[0]).toMatchObject({ sourceType: "call", filePath: "src/example.js", strength: "strong" });
  });

  it("rejects a generic get call and accepts a verified Express receiver", () => {
    expect(analyze("client.get('/users');").roleSignals.express_routing).toBeUndefined();

    const result = analyze('import express from "express"; const app = express(); app.get("/users", handler);');
    expect(result.roleSignals.express_routing).toMatchObject({ signal: "express_routing", strength: 3 });
  });

  it("requires a testing import and a separate test declaration", () => {
    expect(analyze("test('name', () => {});").roleSignals.testing).toBeUndefined();

    const result = analyze('import { test } from "vitest"; test("name", () => {});');
    expect(result.roleSignals.testing).toMatchObject({ signal: "testing", strength: 2, occurrences: 2 });
  });

  it("preserves candidates without allowing them into roleSignals", () => {
    const result = analyze('import { test } from "vitest";');

    expect(result.roleSignals.testing).toBeUndefined();
    expect(result.candidateSignals.testing).toMatchObject({ status: "candidate" });
  });

  it("deduplicates the same AST evidence and does not use occurrence count as strength", () => {
    const result = analyze('import express from "express"; const app = express(); app.get("/", handler); app.get("/", handler);');
    const signal = result.roleSignals.express_routing;

    expect(signal.occurrences).toBe(2);
    expect(signal.strength).toBe(3);
    expect(new Set(signal.evidence.map(item => item.id)).size).toBe(signal.evidence.length);
  });

  it("recognizes CommonJS Express routers and model bindings", () => {
    const result = analyze(`
      const express = require("express");
      const Task = require("../models/Task");
      const router = express.Router();
      router.get("/tasks", async (req, res) => res.json(await Task.find()));
    `, "Backend/routes/taskRoutes.js");

    expect(result.roleSignals.express_routing).toMatchObject({ strength: 3 });
    expect(result.roleSignals.database_management).toMatchObject({ strength: 3 });
  });

  it("recognizes React state hooks as frontend state management", () => {
    const result = analyze(`
      import React, { useState } from "react";
      export default function App() { const [tasks, setTasks] = useState([]); return tasks; }
    `, "Frontend/src/App.jsx");

    expect(result.roleSignals.state_management).toMatchObject({ strength: 2 });
  });
});
