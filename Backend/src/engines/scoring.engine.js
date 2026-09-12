import jobs from "../../jobs.js";

const MAX_RESULTS = 3;
const MAX_MISSING_REQUIRED = 1;
const SOFT_REQUIRED_PENALTY = 8;

const STRENGTH_SYMBOLS = Object.freeze({ invalid: 0, weak: 1, medium: 2, strong: 3 });

const BACKEND_ROOT_ALIASES = new Set(["Backend", "backend", "server", "api", "apis", "services", "service"]);
const FRONTEND_ROOT_ALIASES = new Set(["Frontendrepo", "Frontend", "frontend", "client", "web", "app", "ui", "views", "public"]);

/**
 * Scores only capabilities already established by the normalizer.
 */
export function scoreRepository(roleSignals = {}, isToy = false, structure) {
  const sideRoots = deriveSideRoots(structure);
  return jobs
    .map(role => scoreRole(role, roleSignals, isToy, sideRoots))
    .filter(role => role.isEligible && role.finalScore > 0)
    .sort(compareRoles)
    .slice(0, MAX_RESULTS)
    .map(({ isEligible, ...role }, index) => ({ ...role, rank: index + 1 }));
}

function scoreRole(role, roleSignals, isToy, sideRoots) {
  const configuredCapabilities = Array.isArray(role.capabilities) ? role.capabilities : [];
  const maximumBaseScore = sum(configuredCapabilities.map(capability => capability.points));
  const matchedSignals = [];
  let totalBonusPoints = 0;
  const roleRoots = resolveRoleRoots(role, sideRoots);
  const scopeEvidence = Array.isArray(roleRoots);

  // Synergy Definitions
  const synergies = [
    { pair: ["express_routing", "database_management"], bonus: 5, label: "Full Backend Flow" },
    { pair: ["token_authentication", "password_security"], bonus: 5, label: "Security Focus" },
    { pair: ["ci_configuration", "testing"], bonus: 5, label: "DevOps/QA Alignment" }
  ];

  for (const capability of configuredCapabilities) {
    const sourceSignal = roleSignals[capability.id];
    const evidence = scopeEvidence ? scopeSignalToRoots(sourceSignal, roleRoots) : sourceSignal;
    if (!evidence || evidence.strength < capability.minimumStrength) continue;

    const distribution = Object.keys(evidence.filePaths ?? {}).length;
    const occurrences = evidence.occurrences ?? 0;

    // Depth Bonus: Reward repeated, distributed use of a capability
    // Max bonus is 20% of the capability points
    const depthBonus = (occurrences > 5 && distribution > 2)
      ? Math.min(capability.points * 0.2, (occurrences / 10) + (distribution * 0.5))
      : 0;

    totalBonusPoints += depthBonus;

    matchedSignals.push({
      signal: capability.id,
      score: capability.points + round(depthBonus),
      points: capability.points,
      depthBonus: round(depthBonus),
      weightedPoints: capability.points + depthBonus,
      strength: evidence.strength,
      occurrences,
      distribution,
      filePaths: evidence.filePaths ?? {}
    });
  }

  const matchedIds = new Set(matchedSignals.map(match => match.signal));

  // Calculate Synergy Bonuses
  for (const synergy of synergies) {
    if (synergy.pair.every(id => matchedIds.has(id))) {
      totalBonusPoints += synergy.bonus;
    }
  }

  const requiredCapabilities = configuredCapabilities.filter(capability => capability.required);

  const essentialCapabilities = configuredCapabilities.filter(capability => capability.essential);
  const establishedRequired = requiredCapabilities.filter(capability => matchedIds.has(capability.id)).length;
  const missingRequired = requiredCapabilities.length - establishedRequired;

  // Partial eligibility: every essential (hard-gate) capability must match, but a
  // limited number of non-essential required capabilities may be absent and merely
  // reduce the final score.
  let isEligible = essentialCapabilities.every(capability => matchedIds.has(capability.id))
    && missingRequired <= MAX_MISSING_REQUIRED;
  if (isToy && role.id !== "frontend_developer") { // Frontend roles often have many toy-like repos (CSS/HTML demos)
    isEligible = false;
  }

  const weightedScore = sum(matchedSignals.map(match => match.weightedPoints));
  const coverage = configuredCapabilities.length === 0
    ? 0
    : matchedSignals.length / configuredCapabilities.length;
  
  // Normalize to 100, then hard-clamp so depth/synergy bonuses can never exceed the cap.
  let finalScore = maximumBaseScore === 0
    ? 0
    : round((weightedScore / maximumBaseScore) * 100);
  finalScore = Math.min(100, finalScore);

  // Reduce the score for each missing non-essential required capability.
  finalScore = Math.max(0, finalScore - (missingRequired * SOFT_REQUIRED_PENALTY));

  if (isToy) finalScore = Math.min(finalScore, 40); // Hard cap for toy projects

  return {
    roleId: role.id,
    title: role.title,
    level: role.level,
    rawScore: `${round(weightedScore)}/${maximumBaseScore}`,
    finalScore,
    confidence: round(coverage * 100),
    matchedSignals,
    isEligible,
    isToy,
    suggestedLevel: assessSuggestedLevel(role, matchedSignals, isToy)
  };
}

function assessSuggestedLevel(role, matchedSignals, isToy) {
  if (isToy) return "intern";
  
  const highStrengthMatches = matchedSignals.filter(m => m.strength === "strong").length;
  const deepMatches = matchedSignals.filter(m => m.depthBonus > 0).length;
  
  // Complexity Score: a mix of variety, strength, and depth
  const complexityScore = (matchedSignals.length * 1) + (highStrengthMatches * 2) + (deepMatches * 2);
  
  if (complexityScore >= 12) return "middle";
  if (complexityScore >= 7) return "junior";
  return "intern";
}

function deriveSideRoots(structure) {
  if (!Array.isArray(structure) || structure.length === 0) return null;
  const topLevels = [...new Set(structure
    .filter(p => typeof p === "string" && p.includes("/"))
    .map(p => p.split("/")[0]))];
  if (topLevels.length === 0) return null;
  const backend = topLevels.filter(root => BACKEND_ROOT_ALIASES.has(root));
  const frontend = topLevels.filter(root => FRONTEND_ROOT_ALIASES.has(root));
  return backend.length > 0 && frontend.length > 0 ? { backend, frontend } : null;
}

function resolveRoleRoots(role, sideRoots) {
  if (!sideRoots) return null;
  if (role.side === "backend") return sideRoots.backend;
  if (role.side === "frontend") return sideRoots.frontend;
  if (role.side === "both") return [...sideRoots.backend, ...sideRoots.frontend];
  return null;
}

function scopeSignalToRoots(signal, roots) {
  if (!signal || !roots || roots.length === 0) return signal;
  const scoped = (signal.evidence ?? []).filter(item => roots.some(root => pathUnderRoot(item.filePath, root)));
  if (scoped.length === 0) return null;
  return {
    ...signal,
    occurrences: scoped.length,
    filePaths: countFilePaths(scoped),
    strength: Math.max(0, ...scoped.map(item => STRENGTH_SYMBOLS[item.strength] ?? 0)),
    evidence: scoped
  };
}

function pathUnderRoot(filePath, root) {
  if (typeof filePath !== "string") return false;
  return filePath === root
    || filePath.startsWith(root + "/")
    || filePath.startsWith(root + "\\");
}

function countFilePaths(evidence) {
  return evidence.reduce((result, item) => {
    result[item.filePath] = (result[item.filePath] ?? 0) + 1;
    return result;
  }, {});
}

function compareRoles(a, b) {
  return b.finalScore - a.finalScore
    || b.confidence - a.confidence
    || b.matchedSignals.length - a.matchedSignals.length
    || a.roleId.localeCompare(b.roleId);
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function round(value) {
  return Math.round(value * 100) / 100;
}
