const STRENGTH_SCORES = Object.freeze({
  invalid: 0,
  weak: 1,
  medium: 2,
  strong: 3
});

/**
 * Capability rules consume explicitly named raw signals. They never infer a
 * capability from a filename, dependency, generic method name, or count.
 */
export const CAPABILITY_DEFINITIONS = Object.freeze({
  express_routing: definition("Express routing", ["express_route"], "One strong route registration on a recognized Express receiver."),
  express_middleware: definition("Express middleware", ["express_middleware"], "One strong middleware registration on a recognized Express receiver."),
  database_management: definition("Database management", ["database_operation", "prisma_operation", "sqlalchemy_model", "django_model", "spring_repository", "jpa_entity", "hibernate_session"], "One strong database operation on a recognized database-client binding."),
  token_authentication: definition("Token authentication", ["authentication_operation"], "One medium token signing or verification operation."),
  password_security: definition("Password security", ["password_operation"], "One medium password hashing or comparison operation."),
  file_io: definition("File I/O", ["file_io"], "One medium filesystem operation."),
  input_validation: definition("Input validation", ["validation", "zod_validation", "pydantic_model"], "A validation import plus a verified validation-library call."),
  state_management: definition("State management", ["state_management"], "A state-library import plus a verified state-management operation."),
  testing: definition("Testing", ["testing"], "A medium test-framework import and a separate test declaration."),
  error_handling: definition("Error handling", ["error_handling"], "One medium try/catch construct."),
  ci_configuration: definition("CI configuration", ["ci_configuration"], "One CI configuration artifact."),
  container_configuration: definition("Container configuration", ["container_configuration"], "One Docker configuration artifact."),
  python_backend: definition("Python backend", ["django_route", "flask_route", "fastapi_route"], "One strong Python routing signal."),
  java_backend: definition("Java backend", ["spring_route", "jakarta_ee"], "One strong Java routing signal.")
});

const CAPABILITY_RULES = [
  rule("express_routing", has("express_route", 3)),
  rule("express_middleware", has("express_middleware", 3)),
  rule("database_management", any(has("database_operation", 3), has("prisma_operation", 3), has("django_model", 3), has("spring_repository", 3))),
  rule("token_authentication", has("authentication_operation", 2)),
  rule("password_security", has("password_operation", 2)),
  rule("file_io", has("file_io", 2)),
  rule("input_validation", any(all(has("validation", 2, "import"), has("validation", 2, "call")), has("zod_validation", 3), has("pydantic_model", 2))),
  rule("state_management", all(has("state_management", 2, "import"), has("state_management", 2, "call"))),
  rule("testing", any(all(has("testing", 2, "import"), has("testing", 1, "call")), has("pytest", 2), has("junit_test", 2))),
  rule("error_handling", has("error_handling", 2)),
  rule("ci_configuration", has("ci_configuration", 1)),
  rule("container_configuration", has("container_configuration", 1)),
  rule("python_backend", any(has("django_route", 3), has("flask_route", 3), has("fastapi_route", 3))),
  rule("java_backend", any(has("spring_route", 3), has("jakarta_ee", 2)))
];

/**
 * Produces only established capabilities in roleSignals. candidateSignals
 * preserves partial evidence and failed gates for explanation without letting
 * it influence a later scoring stage.
 */
export function generalizeRoleSignals(detailedSignals = {}) {
  const evidenceByRawSignal = indexEvidence(detailedSignals);
  const roleSignals = {};
  const candidateSignals = {};
  const consumedDetailKeys = new Set();

  for (const { signal, establishes } of CAPABILITY_RULES) {
    const definition = CAPABILITY_DEFINITIONS[signal];
    const evidence = collectEvidence(evidenceByRawSignal, definition.allowedRawSignals);
    if (!evidence.length) continue;

    if (establishes(evidenceByRawSignal)) {
      roleSignals[signal] = createRoleSignal(signal, evidence);
      for (const item of evidence) consumedDetailKeys.add(item.detailKey);
      continue;
    }

    candidateSignals[signal] = {
      signal,
      status: "candidate",
      evidence: uniqueEvidence(evidence).map(stripInternalFields),
      missingRequirement: definition.aggregationRule
    };
  }

  return {
    roleSignals,
    candidateSignals,
    detailedSignals,
    unmappedSignals: Object.fromEntries(
      Object.entries(detailedSignals).filter(([key]) => !consumedDetailKeys.has(key))
    )
  };
}

function definition(name, allowedRawSignals, aggregationRule) {
  return { name, allowedRawSignals, aggregationRule };
}

function rule(signal, establishes) {
  return { signal, establishes };
}

function has(rawSignal, minimumStrength, sourceType) {
  return evidenceByRawSignal => (evidenceByRawSignal.get(rawSignal) ?? []).some(evidence =>
    strengthOf(evidence) >= minimumStrength
    && (!sourceType || evidence.sourceType === sourceType)
  );
}

function all(...requirements) {
  return evidenceByRawSignal => requirements.every(requirement => requirement(evidenceByRawSignal));
}

function any(...requirements) {
  return evidenceByRawSignal => requirements.some(requirement => requirement(evidenceByRawSignal));
}

function indexEvidence(detailedSignals) {
  const indexed = new Map();
  for (const [detailKey, detail] of Object.entries(detailedSignals)) {
    const rawSignal = detailKey.split(":")[0];
    const entries = indexed.get(rawSignal) ?? [];
    for (const evidence of detail.evidence ?? []) entries.push({ ...evidence, detailKey, rawSignal });
    indexed.set(rawSignal, entries);
  }
  return indexed;
}

function collectEvidence(indexed, rawSignals) {
  return uniqueEvidence(rawSignals.flatMap(signal => indexed.get(signal) ?? []));
}

function createRoleSignal(signal, evidence) {
  const unique = uniqueEvidence(evidence);
  return {
    signal,
    occurrences: unique.length,
    filePaths: countFilePaths(unique),
    evidence: unique.map(stripInternalFields),
    strength: Math.max(0, ...unique.map(strengthOf))
  };
}

function uniqueEvidence(evidence) {
  const seen = new Set();
  return evidence.filter(item => {
    const key = item.id ?? `${item.detailKey}:${item.filePath}:${item.line}:${item.column}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function countFilePaths(evidence) {
  return evidence.reduce((result, item) => {
    result[item.filePath] = (result[item.filePath] ?? 0) + 1;
    return result;
  }, {});
}

function strengthOf(evidence) {
  return STRENGTH_SCORES[evidence.strength] ?? 0;
}

function stripInternalFields({ detailKey, rawSignal, ...evidence }) {
  return evidence;
}
