export const PYTHON_PATTERNS = [
  { id: "django_route", category: "Routing", regex: /path\(|url\(/g, strength: "strong" },
  { id: "flask_route", category: "Routing", regex: /@app\.route\(|@blueprint\.route\(/g, strength: "strong" },
  { id: "fastapi_route", category: "Routing", regex: /@app\.(get|post|put|delete|patch)\(/g, strength: "strong" },
  { id: "sqlalchemy_model", category: "Database", regex: /Column\(|relationship\(|class.*\(Base\):/g, strength: "strong" },
  { id: "django_model", category: "Database", regex: /models\.Model/g, strength: "strong" },
  { id: "pydantic_model", category: "Validation", regex: /BaseModel/g, strength: "medium" },
  { id: "pytest", category: "Testing", regex: /pytest\.mark|def test_/g, strength: "medium" },
  { id: "unittest", category: "Testing", regex: /unittest\.TestCase/g, strength: "medium" }
];

export function extractPythonCodeSignals(content, filePath) {
  const signals = [];
  for (const pattern of PYTHON_PATTERNS) {
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
