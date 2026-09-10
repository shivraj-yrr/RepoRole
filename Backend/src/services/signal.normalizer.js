const STRENGTH_SCORES = Object.freeze({
  invalid: 0,
  weak: 1,
  medium: 2,
  strong: 3
});

/**
 * Capability rules deliberately consume distinct raw-signal families.
 * No rule infers a capability from a framework, dependency, filename, or
 * generic method name. In particular, crud_operation is not database management.
 */
export const CAPABILITY_DEFINITIONS = Object.freeze({
  express_routing: capability("Express routing", "Express app/router route registration.", ["express_route"], "At least one strong express_route evidence item."),
  express_middleware: capability("Express middleware", "Express app/router middleware registration.", ["express_middleware"], "At least one strong express_middleware evidence item."),
  token_authentication: capability("Token authentication", "JWT signing or verification implementation.", ["authentication_operation"], "At least one medium authentication_operation evidence item."),
  password_security: capability("Password security", "Bcrypt password hashing or comparison implementation.", ["password_operation"], "At least one medium password_operation evidence item."),
  file_io: capability("File I/O", "Filesystem read or write implementation.", ["file_io"], "At least one medium file_io evidence item."),
  input_validation: capability("Input validation", "Validation-library implementation.", ["validation"], "At least one medium validation evidence item."),
  state_management: capability("State management", "State-library integration in source code.", ["state_management"], "At least one medium state_management evidence item."),
  testing: capability("Testing", "Test framework integration and test declarations.", ["testing"], "One medium framework-import item and one separate weak-or-strong test declaration item."),
  error_handling: capability("Error handling", "Explicit try/catch error handling.", ["error_handling"], "At least one medium error_handling evidence item."),
  ci_configuration: capability("CI configuration", "CI workflow configuration present.", ["ci_configuration"], "At least one configuration evidence item."),
  container_configuration: capability("Container configuration", "Docker configuration present.", ["container_configuration"], "At least one configuration evidence item.")
});

const CAPABILITY_RULES = [
  rule("express_routing", evidence => hasEvidence(evidence, "express_route", 3)),
  rule("express_middleware", evidence => hasEvidence(evidence, "express_middleware", 3)),
  rule("token_authentication", evidence => hasEvidence(evidence, "authentication_operation", 2)),
  rule("password_security", evidence => hasEvidence(evidence, "password_operation", 2)),
  rule("file_io", evidence => hasEvidence(evidence, "file_io", 2)),
  rule("input_validation", evidence => hasEvidence(evidence, "validation", 2)),
  rule("state_management", evidence => hasEvidence(evidence, "state_management", 2)),
  rule("testing", evidence => hasEvidence(evidence, "testing", 2, "import") && hasEvidence(evidence, "testing", 1, "call")),
  rule("error_handling", evidence => hasEvidence(evidence, "error_handling", 2)),
  rule("ci_configuration", evidence => hasEvidence(evidence, "ci_configuration", 1)),
  rule("container_configuration", evidence => hasEvidence(evidence, "container_configuration", 1))
];

/**
 * Converts raw/low-level evidence into established capability signals.
 * Output contains only capabilities whose own gates are met. Evidence remains
 * lossless and provenance is retained so callers can explain every result.
 */
export function generalizeRoleSignals(detailedSignals = {}) {
  const evidenceByRawSignal = indexEvidence(detailedSignals);
  const roleSignals = {};
  const consumedDetailKeys = new Set();

  for (const { signal, establishes } of CAPABILITY_RULES) {
    if (!establishes(evidenceByRawSignal)) continue;

    const evidence = uniqueEvidence(evidenceByRawSignal.get(signal) ?? []);
    if (!evidence.length) continue;

    roleSignals[signal] = createRoleSignal(signal, evidence);
    for (const item of evidence) consumedDetailKeys.add(item.detailKey);
  }

  return {
    roleSignals,
    detailedSignals,
    unmappedSignals: Object.fromEntries(
      Object.entries(detailedSignals).filter(([key]) => !consumedDetailKeys.has(key))
    )
  };
}

function capability(name, represents, allowedRawSignals, aggregationRule) {
  return { name, represents, allowedRawSignals, aggregationRule };
}

function rule(signal, establishes) {
  return { signal, establishes };
}

function indexEvidence(detailedSignals) {
  const evidenceByRawSignal = new Map();

  for (const [detailKey, detail] of Object.entries(detailedSignals)) {
    const rawSignal = detailKey.split(":")[0];
    const entries = evidenceByRawSignal.get(rawSignal) ?? [];

    for (const evidence of detail.evidence ?? []) {
      entries.push({ ...evidence, detailKey, rawSignal });
    }
    evidenceByRawSignal.set(rawSignal, entries);
  }
  return evidenceByRawSignal;
}

function hasEvidence(evidenceByRawSignal, rawSignal, minimumStrength, sourceType) {
  return (evidenceByRawSignal.get(rawSignal) ?? []).some(evidence =>
    strengthOf(evidence) >= minimumStrength
    && (!sourceType || evidence.sourceType === sourceType)
  );
}

function createRoleSignal(signal, evidence) {
  const unique = uniqueEvidence(evidence);
  return {
    signal,
    occurrences: unique.length,
    filePaths: countFilePaths(unique),
    evidence: unique.map(stripInternalEvidenceFields),
    strength: capabilityStrength(unique)
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
  return evidence.reduce((filePaths, item) => {
    filePaths[item.filePath] = (filePaths[item.filePath] ?? 0) + 1;
    return filePaths;
  }, {});
}

function capabilityStrength(evidence) {
  // Strength is evidence quality, not a count. Repeating the same pattern
  // cannot turn weak evidence into a stronger capability.
  return Math.max(0, ...evidence.map(strengthOf));
}

function strengthOf(evidence) {
  return STRENGTH_SCORES[evidence.strength] ?? 0;
}

function stripInternalEvidenceFields({ detailKey, rawSignal, ...evidence }) {
  return evidence;
}
