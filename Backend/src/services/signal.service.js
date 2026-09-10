import { createRequire } from "module";

const require = createRequire(import.meta.url);
const traverse = require("@babel/traverse").default;

export const EVIDENCE_STRENGTH = Object.freeze({
  STRONG: "strong",
  MEDIUM: "medium",
  WEAK: "weak",
  INVALID: "invalid"
});

// These are deliberately low-level signals. A method name alone is never a capability.
export const SIGNAL_DEFINITIONS = Object.freeze({
  crud_operation: definition("CRUD operation", "A read or write-like method call.", "Call expression", "A generic method name without a verified database client.", "Filenames, dependencies, or occurrence count."),
  express_route: definition("Express route registration", "A route method called on app or router.", "app.get(), router.post(), or an equivalent explicit router receiver.", "A generic get/post call.", "Express dependency alone."),
  express_middleware: definition("Express middleware registration", "Middleware registered on an Express app or router.", "app.use() or router.use().", "A generic use() call.", "Express dependency alone."),
  authentication_operation: definition("Authentication operation", "A token signing or verification call.", "jwt.sign() or jwt.verify() with an identifiable jwt receiver.", "A generic sign() or verify() call.", "A filename containing auth."),
  password_operation: definition("Password hashing operation", "A password hash or comparison call.", "bcrypt.hash() or bcrypt.compare() with an identifiable bcrypt receiver.", "A generic hash() or compare() call.", "A filename containing password."),
  file_io: definition("File I/O", "A filesystem read or write call.", "fs.readFile(), fs.writeFile(), or fs.appendFile().", "A generic matching method call.", "A filename or dependency alone."),
  validation: definition("Input validation", "Validation-library use or validation middleware.", "A recognized validation import or call.", "A matching method without library context.", "A validation-like filename."),
  react_hook: definition("React hook", "A recognized React hook call.", "useState(), useEffect(), etc.", "A similarly named local function.", "React dependency alone."),
  state_management: definition("State-management use", "Redux/MobX API use or provider.", "Recognized import, hook, or provider.", "A matching local identifier.", "Dependency alone."),
  testing: definition("Test declaration", "A test framework import or test declaration.", "Framework import plus describe/it/test/expect usage.", "A generic test-like call.", "A test filename alone."),
  error_handling: definition("Error handling", "A try/catch construct.", "TryStatement AST node.", "None.", "Occurrence count alone."),
  async_operation: definition("Asynchronous operation", "An async function or await expression.", "Async AST syntax.", "None.", "Occurrence count alone."),
  project_structure: definition("Project structure", "A conventional source-tree location.", "A path in a recognized controller/service/component directory.", "A partial path-name match.", "The directory name by itself as proof of a capability."),
  ci_configuration: definition("CI configuration", "A recognized CI configuration file.", ".github/workflows or Jenkins configuration path.", "A generic configuration file.", "Framework or dependency detection."),
  container_configuration: definition("Container configuration", "A Docker configuration file.", "Dockerfile or docker-compose.yml path.", "A similarly named source file.", "A Docker-related dependency.")
});

const CALL_DETECTORS = [
  callDetector("crud_operation", "CRUD operation", ["find", "findOne", "insert", "update", "delete", "save", "remove"], EVIDENCE_STRENGTH.WEAK),
  callDetector("express_route", "Express route registration", ["get", "post", "put", "delete", "patch"], EVIDENCE_STRENGTH.STRONG, isExpressRouterCall),
  callDetector("express_middleware", "Express middleware registration", ["use"], EVIDENCE_STRENGTH.STRONG, isExpressRouterCall),
  callDetector("authentication_operation", "Authentication operation", ["sign", "verify"], EVIDENCE_STRENGTH.MEDIUM, isJwtCall),
  callDetector("password_operation", "Password hashing operation", ["hash", "compare"], EVIDENCE_STRENGTH.MEDIUM, isBcryptCall),
  callDetector("file_io", "File I/O", ["readFile", "writeFile", "appendFile"], EVIDENCE_STRENGTH.MEDIUM, isFsCall),
  callDetector("validation", "Input validation", ["zod", "joi", "yup", "validationResult"], EVIDENCE_STRENGTH.WEAK),
  callDetector("react_hook", "React hook", ["useState", "useEffect", "useContext", "useReducer", "useCallback", "useMemo"], EVIDENCE_STRENGTH.WEAK),
  callDetector("state_management", "State-management use", ["createStore", "combineReducers", "applyMiddleware", "connect", "useSelector", "useDispatch"], EVIDENCE_STRENGTH.WEAK),
  callDetector("testing", "Test declaration", ["describe", "it", "test", "expect"], EVIDENCE_STRENGTH.WEAK)
];

const IMPORT_DETECTORS = [
  importDetector("validation", "Input validation", ["zod", "joi", "yup", "express-validator"], EVIDENCE_STRENGTH.MEDIUM),
  importDetector("state_management", "State-management use", ["redux", "react-redux", "mobx", "mobx-react"], EVIDENCE_STRENGTH.MEDIUM),
  importDetector("testing", "Test declaration", ["jest", "mocha", "chai", "vitest"], EVIDENCE_STRENGTH.MEDIUM)
];

const JSX_DETECTORS = [
  jsxDetector("state_management", "State-management use", ["Provider"], EVIDENCE_STRENGTH.WEAK)
];

const STRUCTURE_DETECTORS = [
  structureDetector("project_structure", "Project structure", "controller", path => hasPathPart(path, "controller")),
  structureDetector("project_structure", "Project structure", "service", path => hasPathPart(path, "service")),
  structureDetector("project_structure", "Project structure", "component", path => hasPathPart(path, "component")),
  structureDetector("ci_configuration", "CI configuration", "github-actions", path => path.includes(".github/workflows/")),
  structureDetector("ci_configuration", "CI configuration", "jenkins", path => path.includes("jenkins")),
  structureDetector("container_configuration", "Container configuration", "dockerfile", path => path.endsWith("dockerfile")),
  structureDetector("container_configuration", "Container configuration", "docker-compose", path => path.endsWith("docker-compose.yml"))
];

export function extractCodeSignals(parsedFiles, treeStructure = []) {
  const signalMap = new Map();

  for (const entry of parsedFiles) {
    if (!entry?.ast || !entry?.path) continue;
    traverse(entry.ast, {
      CallExpression(path) { recordMatches(signalMap, CALL_DETECTORS, getCallOperation(path.node), entry.path, path.node, path.node.loc, "call"); },
      ImportDeclaration(path) { recordMatches(signalMap, IMPORT_DETECTORS, path.node.source.value, entry.path, path.node, path.node.loc, "import"); },
      JSXOpeningElement(path) { recordMatches(signalMap, JSX_DETECTORS, getJSXName(path.node.name), entry.path, path.node, path.node.loc, "jsx"); },
      TryStatement(path) { recordSignal(signalMap, "error_handling", "Error handling", "try", entry.path, EVIDENCE_STRENGTH.MEDIUM, "syntax", path.node.loc); },
      AwaitExpression(path) { recordSignal(signalMap, "async_operation", "Asynchronous operation", "await", entry.path, EVIDENCE_STRENGTH.WEAK, "syntax", path.node.loc); },
      Function(path) { if (path.node.async) recordSignal(signalMap, "async_operation", "Asynchronous operation", "async", entry.path, EVIDENCE_STRENGTH.WEAK, "syntax", path.node.loc); }
    });
  }

  for (const entry of toArray(treeStructure)) {
    const filePath = typeof entry === "string" ? entry : entry?.path;
    if (!filePath) continue;
    for (const detector of STRUCTURE_DETECTORS) {
      if (detector.matches(filePath.toLowerCase())) recordSignal(signalMap, detector.id, detector.category, detector.signal, filePath, EVIDENCE_STRENGTH.WEAK, "structure");
    }
  }
  return serializeSignalMap(signalMap);
}

export function extractManifestSignals(manifests, projectSignals) {
  if (!projectSignals) return {};
  for (const manifest of manifests) {
    switch (manifest.name) {
      case "package.json": projectSignals.buildFiles?.add?.("package.json"); extractNodeSignals(manifest, projectSignals); break;
      case "requirements.txt": case "pyproject.toml": projectSignals.buildFiles?.add?.(manifest.name); extractPythonSignals(manifest, projectSignals); break;
      case "pom.xml": case "build.gradle": case "build.gradle.kts": projectSignals.buildFiles?.add?.(manifest.name); extractJavaSignals(manifest, projectSignals); break;
      case "CMakeLists.txt": projectSignals.buildFiles?.add?.("CMakeLists.txt"); extractCppSignals(manifest, projectSignals); break;
    }
  }
  return projectSignals;
}

function definition(name, represents, validEvidence, weakEvidence, invalidEvidence) { return { name, represents, validEvidence, weakEvidence, invalidEvidence }; }
function callDetector(id, category, operations, strength, matches) { return { id, category, operations: new Set(operations), strength, matches }; }
function importDetector(id, category, operations, strength) { return callDetector(id, category, operations, strength); }
function jsxDetector(id, category, operations, strength) { return callDetector(id, category, operations, strength); }
function structureDetector(id, category, signal, matches) { return { id, category, signal, matches }; }

function recordMatches(signalMap, detectors, operation, filePath, node, loc, sourceType) {
  if (!operation) return;
  for (const detector of detectors) {
    if (detector.operations.has(operation) && (!detector.matches || detector.matches(node))) recordSignal(signalMap, detector.id, detector.category, operation, filePath, detector.strength, sourceType, loc);
  }
}

function recordSignal(signalMap, id, category, signal, filePath, strength, sourceType, loc) {
  const key = `${id}:${signal}`;
  const start = loc?.start;
  const evidenceId = `${key}:${filePath}:${start?.line ?? "path"}:${start?.column ?? ""}`;
  const data = signalMap.get(key) ?? { signal, category, definition: SIGNAL_DEFINITIONS[id], occurrences: 0, filePaths: new Map(), evidence: [], evidenceIds: new Set() };
  if (data.evidenceIds.has(evidenceId)) return;
  data.evidenceIds.add(evidenceId);
  data.occurrences += 1;
  data.filePaths.set(filePath, (data.filePaths.get(filePath) ?? 0) + 1);
  data.evidence.push({ id: evidenceId, sourceType, filePath, line: start?.line ?? null, column: start?.column ?? null, strength });
  signalMap.set(key, data);
}

function serializeSignalMap(signalMap) {
  return Object.fromEntries([...signalMap].map(([key, data]) => {
    const { evidenceIds, ...serializable } = data;
    return [key, { ...serializable, filePaths: Object.fromEntries(data.filePaths) }];
  }));
}

function getCallOperation(node) { if (node.callee.type === "Identifier") return node.callee.name; if (node.callee.type !== "MemberExpression") return null; return node.callee.property.type === "Identifier" || node.callee.property.type === "StringLiteral" ? node.callee.property.name ?? node.callee.property.value : null; }
function getCallReceiver(node) { return node?.callee?.type === "MemberExpression" && node.callee.object.type === "Identifier" ? node.callee.object.name.toLowerCase() : null; }
function isExpressRouterCall(node) { const receiver = getCallReceiver(node); return receiver === "app" || receiver === "router" || receiver?.endsWith("router"); }
function isJwtCall(node) { return getCallReceiver(node)?.includes("jwt"); }
function isBcryptCall(node) { return getCallReceiver(node)?.includes("bcrypt"); }
function isFsCall(node) { const receiver = getCallReceiver(node); return receiver === "fs" || receiver === "fsp" || receiver?.includes("filesystem"); }
function getJSXName(node) { return node.type === "JSXIdentifier" ? node.name : node.type === "JSXMemberExpression" ? getJSXName(node.property) : null; }
function hasPathPart(path, term) { return path.split("/").some(part => part.includes(term)); }
function toArray(value) { return Array.isArray(value) ? value : value ? [value] : []; }
function decodeManifest(item) { return Buffer.from(item.content, "base64").toString("utf-8"); }
function extractNodeSignals(item, projectSignals) { const pkg = JSON.parse(decodeManifest(item)); const deps = { ...pkg.dependencies, ...pkg.devDependencies }; projectSignals.runtime.add("Node.js"); if (deps.react) projectSignals.frameworks.add("React"); if (deps.next) projectSignals.frameworks.add("NextJS"); if (deps.express) projectSignals.frameworks.add("Express"); if (deps["@nestjs/core"]) projectSignals.frameworks.add("NestJS"); if (deps.redux) projectSignals.frameworks.add("Redux"); if (deps["react-router-dom"] || deps["react-router"]) projectSignals.frameworks.add("React Router"); if (deps.mongoose) projectSignals.databases.add("MongoDB"); if (deps.pg) projectSignals.databases.add("PostgreSQL"); if (deps.mysql2) projectSignals.databases.add("MySQL"); if (deps.redis) projectSignals.databases.add("Redis"); if (deps.prisma) projectSignals.flags.add("Prisma"); }
function extractPythonSignals(item, projectSignals) { const dependencies = decodeManifest(item).split("\n").map(line => line.replace(/[#;].*$/, "").trim()).map(line => line.replace(/^["']|["'],?$/g, "")).map(line => line.split(/[>=<~!]/)[0].trim().toLowerCase()).filter(Boolean); projectSignals.runtime.add("Python"); if (dependencies.some(dep => ["tensorflow", "torch", "scikit-learn", "keras", "xgboost", "lightgbm", "catboost", "pytorch", "numpy", "pandas"].includes(dep))) projectSignals.flags.add("ML/AI"); if (dependencies.includes("django")) projectSignals.frameworks.add("Django"); if (dependencies.includes("flask")) projectSignals.frameworks.add("Flask"); if (dependencies.includes("fastapi")) projectSignals.frameworks.add("FastAPI"); if (dependencies.includes("sqlalchemy")) projectSignals.databases.add("PostgreSQL"); if (dependencies.includes("mysql-connector-python")) projectSignals.databases.add("MySQL"); if (dependencies.includes("pymongo")) projectSignals.databases.add("MongoDB"); if (dependencies.includes("redis")) projectSignals.databases.add("Redis"); }
function extractJavaSignals(item, projectSignals) { const content = decodeManifest(item).toLowerCase(); projectSignals.runtime.add("JVM"); if (content.includes("spring-boot")) { projectSignals.frameworks.add("Spring Boot"); projectSignals.flags.add("rest"); } if (content.includes("springframework")) projectSignals.frameworks.add("Spring Framework"); if (content.includes("hibernate")) { projectSignals.frameworks.add("Hibernate"); projectSignals.flags.add("orm"); } if (content.includes("micronaut")) projectSignals.frameworks.add("Micronaut"); if (content.includes("quarkus")) projectSignals.frameworks.add("Quarkus"); if (content.includes("react")) projectSignals.frameworks.add("React"); if (content.includes("angular")) projectSignals.frameworks.add("Angular"); if (content.includes("vue")) projectSignals.frameworks.add("Vue"); if (content.includes("postgresql")) projectSignals.databases.add("PostgreSQL"); if (content.includes("mysql")) projectSignals.databases.add("MySQL"); if (content.includes("mongodb")) projectSignals.databases.add("MongoDB"); if (content.includes("redis")) projectSignals.databases.add("Redis"); }
function extractCppSignals(item, projectSignals) { const content = decodeManifest(item); projectSignals.runtime.add("C++"); if (/find_package\s*\(\s*Boost/i.test(content)) projectSignals.frameworks.add("Boost"); if (/find_package\s*\(\s*(Qt5|Qt)/i.test(content)) projectSignals.frameworks.add("Qt"); if (/find_package\s*\(\s*Eigen3/i.test(content)) projectSignals.frameworks.add("Eigen"); if (/find_package\s*\(\s*Boost_asio/i.test(content)) projectSignals.frameworks.add("Boost.Asio"); if (/find_package\s*\(\s*SQLite3/i.test(content)) projectSignals.databases.add("SQLite"); if (/find_package\s*\(\s*PostgreSQL/i.test(content)) projectSignals.databases.add("PostgreSQL"); if (/find_package\s*\(\s*MySQL/i.test(content)) projectSignals.databases.add("MySQL"); if (/find_package\s*\(\s*MongoDB/i.test(content)) projectSignals.databases.add("MongoDB"); if (/find_package\s*\(\s*Redis/i.test(content)) projectSignals.databases.add("Redis"); if (/find_package\s*\(\s*OpenSSL/i.test(content)) projectSignals.frameworks.add("OpenSSL"); if (/find_package\s*\(\s*ZLIB/i.test(content)) projectSignals.frameworks.add("ZLIB"); }
