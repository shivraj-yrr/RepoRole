import jobs from "../../jobs.js";

const MAX_RESULTS = 3;

/**
 * Scores only capabilities already established by the normalizer.
 */
export function scoreRepository(roleSignals = {}, isToy = false) {
  return jobs
    .map(role => scoreRole(role, roleSignals, isToy))
    .filter(role => role.isEligible && role.finalScore > 0)
    .sort(compareRoles)
    .slice(0, MAX_RESULTS)
    .map(({ isEligible, ...role }, index) => ({ ...role, rank: index + 1 }));
}

function scoreRole(role, roleSignals, isToy) {
  const configuredCapabilities = Array.isArray(role.capabilities) ? role.capabilities : [];
  const maximumBaseScore = sum(configuredCapabilities.map(capability => capability.points));
  const matchedSignals = [];
  let totalBonusPoints = 0;

  // Synergy Definitions
  const synergies = [
    { pair: ["express_routing", "database_management"], bonus: 5, label: "Full Backend Flow" },
    { pair: ["token_authentication", "password_security"], bonus: 5, label: "Security Focus" },
    { pair: ["ci_configuration", "testing"], bonus: 5, label: "DevOps/QA Alignment" }
  ];

  for (const capability of configuredCapabilities) {
    const evidence = roleSignals[capability.id];
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
  
  // Toy projects are ineligible for professional roles unless they are exceptionally strong
  let isEligible = requiredCapabilities.every(capability => matchedIds.has(capability.id));
  if (isToy && role.id !== "frontend_developer") { // Frontend roles often have many toy-like repos (CSS/HTML demos)
    isEligible = false;
  }

  const weightedScore = sum(matchedSignals.map(match => match.weightedPoints));
  const coverage = configuredCapabilities.length === 0
    ? 0
    : matchedSignals.length / configuredCapabilities.length;
  
  // Normalize final score to 100, but allow bonuses to push it slightly higher if exceptional
  let finalScore = maximumBaseScore === 0
    ? 0
    : round((weightedScore / maximumBaseScore) * 100);

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
