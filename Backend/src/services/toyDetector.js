export function detectToyProject(projectSignals) {
  let toyScore = 0;
  let professionalRewards = 0;

  // --- TOY SIGNALS ---
  if (!projectSignals.metadata?.hasReadme) {
    toyScore += 2;
  }

  if (projectSignals.structure?.length <= 1) {
    toyScore += 1;
  }

  if (projectSignals.metadata?.fileCount !== undefined &&
      projectSignals.metadata.fileCount < 10) {
    toyScore += 2;
  }

  if (projectSignals.metadata?.repoName?.match(/tutorial|learn|practice|test|demo|example/i)) {
    toyScore += 2;
  }

  // --- PROFESSIONAL REWARDS (Negative Signals for "Toy-ness") ---
  
  // 1. CI/CD Evidence
  if (projectSignals.detailedSignals?.["ci_configuration:github-actions"] || 
      projectSignals.detailedSignals?.["ci_configuration:jenkins"]) {
    professionalRewards += 2;
  }

  // 2. Containerization
  if (projectSignals.detailedSignals?.["container_configuration:dockerfile"] ||
      projectSignals.detailedSignals?.["container_configuration:docker-compose"]) {
    professionalRewards += 2;
  }

  // 3. Testing Culture
  const hasTesting = Object.keys(projectSignals.detailedSignals || {}).some(k => k.startsWith("testing:"));
  if (hasTesting) {
    professionalRewards += 2;
  }

  // 4. Complex Structure (Controllers/Services/Models)
  const hasProfessionalStructure = projectSignals.structure?.some(path => 
    path.includes("controller") || path.includes("service") || path.includes("model")
  );
  if (hasProfessionalStructure) {
    professionalRewards += 2;
  }

  // 5. Framework Adoption
  if (projectSignals.frameworks?.size >= 1) {
    professionalRewards += 1;
  }

  // 6. Validation/Security focus
  const hasSecurity = Object.keys(projectSignals.detailedSignals || {}).some(k => 
    k.startsWith("authentication_operation:") || k.startsWith("password_operation:") || k.startsWith("zod_validation:")
  );
  if (hasSecurity) {
    professionalRewards += 1;
  }

  const finalScore = toyScore - professionalRewards;

  // A project is a "toy" if it has significant toy signals that aren't offset by professional markers
  return finalScore >= 2;
}
