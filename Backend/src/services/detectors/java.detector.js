export const JAVA_PATTERNS = [
  { id: "spring_route", category: "Routing", regex: /@RequestMapping|@GetMapping|@PostMapping|@PutMapping|@DeleteMapping/g, strength: "strong" },
  { id: "spring_service", category: "Architecture", regex: /@Service/g, strength: "strong" },
  { id: "spring_repository", category: "Database", regex: /@Repository|extends.*Repository/g, strength: "strong" },
  { id: "jpa_entity", category: "Database", regex: /@Entity|@Table/g, strength: "strong" },
  { id: "junit_test", category: "Testing", regex: /@Test|@BeforeEach|@AfterEach/g, strength: "medium" },
  { id: "hibernate_session", category: "Database", regex: /SessionFactory|Session\.save|Session\.get/g, strength: "strong" },
  { id: "jakarta_ee", category: "Architecture", regex: /@Inject|@Named|@SessionScoped/g, strength: "medium" }
];

export function extractJavaCodeSignals(content, filePath) {
  const signals = [];
  for (const pattern of JAVA_PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      signals.push({
        id: pattern.id,
        category: pattern.category,
        signal: pattern.id,
        filePath,
        strength: pattern.strength,
        sourceType: "regex",
        occurrences: matches.length
      });
    }
  }
  return signals;
}
