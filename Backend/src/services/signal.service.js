import { createRequire } from "module";

const require = createRequire(import.meta.url);
const traverse = require("@babel/traverse").default;

import { extractPythonCodeSignals } from "./detectors/python.detector.js";
import { extractJavaCodeSignals } from "./detectors/java.detector.js";

export const EVIDENCE_STRENGTH = Object.freeze({
  STRONG: "strong",
  MEDIUM: "medium",
  WEAK: "weak",
  INVALID: "invalid"
});

// These are deliberately low-level signals. A method name alone is never a capability.
export const SIGNAL_DEFINITIONS = Object.freeze({
  crud_operation: definition("CRUD operation", "A read or write-like method call.", "Call expression", "A generic method name without a verified database client.", "Filenames, dependencies, or occurrence count."),
  database_operation: definition("Database operation", "A CRUD-like operation on a recognized database-client binding.", "A database-client binding used for a read or write operation.", "An unverified CRUD method call.", "A dependency, filename, or generic CRUD method."),
  prisma_operation: definition("Prisma operation", "A specific Prisma client operation.", "prisma.user.findUnique(), prisma.$transaction(), etc.", "A generic database operation.", "Prisma dependency alone."),
  express_route: definition("Express route registration", "A route method called on app or router.", "app.get(), router.post(), or an equivalent explicit router receiver.", "A generic get/post call.", "Express dependency alone."),
  express_middleware: definition("Express middleware registration", "Middleware registered on an Express app or router.", "app.use() or router.use().", "A generic use() call.", "Express dependency alone."),
  authentication_operation: definition("Authentication operation", "A token signing or verification call.", "jwt.sign() or jwt.verify() with an identifiable jwt receiver.", "A generic sign() or verify() call.", "A filename containing auth."),
  password_operation: definition("Password hashing operation", "A password hash or comparison call.", "bcrypt.hash() or bcrypt.compare() with an identifiable bcrypt receiver.", "A generic hash() or compare() call.", "A filename containing password."),
  file_io: definition("File I/O", "A filesystem read or write call.", "fs.readFile(), fs.writeFile(), or fs.appendFile().", "A generic matching method call.", "A filename or dependency alone."),
  validation: definition("Input validation", "Validation-library use or validation middleware.", "A recognized validation import or call.", "A matching method without library context.", "A validation-like filename."),
  zod_validation: definition("Zod validation", "A specific Zod schema validation call.", "z.object(), schema.parse(), etc.", "A generic validation call.", "Zod dependency alone."),
  server_action: definition("Server Action", "A Next.js Server Action declaration.", "'use server' directive in a function or file.", "None.", "Next.js dependency alone."),
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
  callDetector("database_operation", "Database operation", ["find", "findOne", "insert", "update", "delete", "save", "remove"], EVIDENCE_STRENGTH.STRONG, isKnownDatabaseClientCall),
  callDetector("prisma_operation", "Prisma operation", ["findUnique", "findFirst", "findMany", "create", "createMany", "update", "updateMany", "upsert", "delete", "deleteMany", "executeRaw", "queryRaw", "$transaction", "$connect", "$disconnect"], EVIDENCE_STRENGTH.STRONG, isPrismaCall),
  callDetector("express_route", "Express route registration", ["get", "post", "put", "delete", "patch"], EVIDENCE_STRENGTH.STRONG, isExpressRouterCall),
  callDetector("express_middleware", "Express middleware registration", ["use"], EVIDENCE_STRENGTH.STRONG, isExpressRouterCall),
  callDetector("authentication_operation", "Authentication operation", ["sign", "verify"], EVIDENCE_STRENGTH.MEDIUM, isJwtCall),
  callDetector("password_operation", "Password hashing operation", ["hash", "compare"], EVIDENCE_STRENGTH.MEDIUM, isBcryptCall),
  callDetector("file_io", "File I/O", ["readFile", "writeFile", "appendFile"], EVIDENCE_STRENGTH.MEDIUM, isFsCall),
  callDetector("validation", "Input validation", ["zod", "joi", "yup", "validationResult"], EVIDENCE_STRENGTH.WEAK),
  callDetector("zod_validation", "Zod validation", ["parse", "safeParse", "parseAsync", "safeParseAsync", "object", "string", "number", "boolean", "array", "enum", "nativeEnum", "optional", "nullable", "union", "intersection", "record", "map", "set", "function", "lazy", "promise", "instanceof"], EVIDENCE_STRENGTH.STRONG, isZodCall),
  callDetector("react_hook", "React hook", ["useState", "useEffect", "useContext", "useReducer", "useCallback", "useMemo"], EVIDENCE_STRENGTH.MEDIUM, isKnownReactHookCall),
  callDetector("state_management", "State-management use", ["useState", "useReducer"], EVIDENCE_STRENGTH.MEDIUM, isKnownReactHookCall),
  callDetector("state_management", "State-management use", ["createStore", "combineReducers", "applyMiddleware", "connect", "useSelector", "useDispatch"], EVIDENCE_STRENGTH.MEDIUM, isKnownStateManagementCall),
  callDetector("testing", "Test declaration", ["describe", "it", "test", "expect"], EVIDENCE_STRENGTH.WEAK, isKnownTestCall)
];

const IMPORT_DETECTORS = [
  importDetector("validation", "Input validation", ["zod", "joi", "yup", "express-validator"], EVIDENCE_STRENGTH.MEDIUM),
  importDetector("state_management", "State-management use", ["react", "redux", "react-redux", "mobx", "mobx-react"], EVIDENCE_STRENGTH.MEDIUM),
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
    if (!entry?.path) continue;

    // Handle non-JS/TS files using regex detectors
    if (entry.path.endsWith(".py") && entry.content) {
      const pythonSignals = extractPythonCodeSignals(entry.content, entry.path);
      pythonSignals.forEach(s => recordSignal(signalMap, s.id, s.category, s.signal, s.filePath, s.strength, s.sourceType));
      continue;
    }

    if (entry.path.endsWith(".java") && entry.content) {
      const javaSignals = extractJavaCodeSignals(entry.content, entry.path);
      javaSignals.forEach(s => recordSignal(signalMap, s.id, s.category, s.signal, s.filePath, s.strength, s.sourceType));
      continue;
    }

    if (!entry?.ast) continue;
    const fileContext = collectFileContext(entry.ast);
    traverse(entry.ast, {
      CallExpression(path) { recordMatches(signalMap, CALL_DETECTORS, getCallOperation(path.node), entry.path, path.node, path.node.loc, "call", fileContext); },
      ImportDeclaration(path) { recordMatches(signalMap, IMPORT_DETECTORS, path.node.source.value, entry.path, path.node, path.node.loc, "import"); },
      JSXOpeningElement(path) { recordMatches(signalMap, JSX_DETECTORS, getJSXName(path.node.name), entry.path, path.node, path.node.loc, "jsx"); },
      TryStatement(path) { recordSignal(signalMap, "error_handling", "Error handling", "try", entry.path, EVIDENCE_STRENGTH.MEDIUM, "syntax", path.node.loc); },
      AwaitExpression(path) { recordSignal(signalMap, "async_operation", "Asynchronous operation", "await", entry.path, EVIDENCE_STRENGTH.WEAK, "syntax", path.node.loc); },
      Function(path) {
        if (path.node.async) recordSignal(signalMap, "async_operation", "Asynchronous operation", "async", entry.path, EVIDENCE_STRENGTH.WEAK, "syntax", path.node.loc);
        if (path.node.body?.directives?.some(d => d.value.value === "use server")) {
          recordSignal(signalMap, "server_action", "Server Action", "use server", entry.path, EVIDENCE_STRENGTH.STRONG, "syntax", path.node.loc);
        }
      },
      Program(path) {
        if (path.node.directives?.some(d => d.value.value === "use server")) {
          recordSignal(signalMap, "server_action", "Server Action", "use server", entry.path, EVIDENCE_STRENGTH.STRONG, "syntax", path.node.loc);
        }
      }
    });
  }

  for (const entry of toArray(treeStructure)) {
    const filePath = typeof entry === "string" ? entry : entry?.path;
    if (!filePath) continue;
    for (const detector of STRUCTURE_DETECTORS) {
      if (detector.matches(filePath.toLowerCase())) recordSignal(signalMap, detector.id, detector.category, detector.signal, filePath, EVIDENCE_STRENGTH.WEAK, "structure");
    }
  }
  const codeSignals=serializeSignalMap(signalMap);
  return codeSignals;
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

function recordMatches(signalMap, detectors, operation, filePath, node, loc, sourceType, fileContext) {
  if (!operation) return;
  for (const detector of detectors) {
    if (detector.operations.has(operation) && (!detector.matches || detector.matches(node, fileContext))) recordSignal(signalMap, detector.id, detector.category, operation, filePath, detector.strength, sourceType, loc);
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
function isExpressRouterCall(node, fileContext) { return fileContext?.expressInstances.has(getCallRootReceiver(node)); }
function isJwtCall(node, fileContext) { return fileContext?.jwtBindings.has(getCallRootReceiver(node)); }
function isBcryptCall(node, fileContext) { return fileContext?.bcryptBindings.has(getCallRootReceiver(node)); }
function isFsCall(node, fileContext) { return fileContext?.fsBindings.has(getCallRootReceiver(node)); }
function isPrismaCall(node, fileContext) { return fileContext?.prismaBindings.has(getCallRootReceiver(node)); }
function isZodCall(node, fileContext) { return fileContext?.zodBindings.has(getCallRootReceiver(node)); }
function isKnownReactHookCall(node, fileContext) { return isKnownBindingCall(node, fileContext?.reactBindings, fileContext?.reactHookBindings); }
function isKnownStateManagementCall(node, fileContext) { return isKnownBindingCall(node, fileContext?.stateBindings, fileContext?.stateOperationBindings); }
function isKnownTestCall(node, fileContext) { return isKnownBindingCall(node, fileContext?.testBindings, fileContext?.testOperationBindings); }
function isKnownBindingCall(node, namespaceBindings, operationBindings) {
  if (node.callee.type === "Identifier") return operationBindings?.has(node.callee.name);
  return namespaceBindings?.has(getCallRootReceiver(node));
}
function isKnownDatabaseClientCall(node, fileContext) { return fileContext?.databaseBindings.has(getCallRootReceiver(node)); }
function getCallRootReceiver(node) {
  const callee = node?.callee;
  if (callee?.type !== "MemberExpression") return null;
  return getRootIdentifier(callee.object);
}
function getRootIdentifier(node) {
  if (node?.type === "Identifier") return node.name;
  if (node?.type === "MemberExpression") return getRootIdentifier(node.object);
  if (node?.type === "CallExpression") return getRootIdentifier(node.callee);
  return null;
}
function collectFileContext(ast) {
  const databaseImports = new Set(["mongoose", "@prisma/client", "sequelize", "typeorm", "mongodb", "pg", "mysql2"]);
  const databaseBindings = new Set();
  const databaseConstructors = new Set();
  const prismaBindings = new Set();
  const zodBindings = new Set();
  const expressBindings = new Set();
  const expressInstances = new Set();
  const jwtBindings = new Set();
  const bcryptBindings = new Set();
  const fsBindings = new Set();
  const reactBindings = new Set();
  const reactHookBindings = new Set();
  const stateBindings = new Set();
  const stateOperationBindings = new Set();
  const testBindings = new Set();
  const testOperationBindings = new Set();
  traverse(ast, {
    ImportDeclaration(path) {
      for (const specifier of path.node.specifiers) {
        const local = specifier.local.name;
        if (databaseImports.has(path.node.source.value)) {
          databaseBindings.add(local);
          databaseConstructors.add(local);
        }
        if (path.node.source.value === "@prisma/client") prismaBindings.add(local);
        if (path.node.source.value === "zod") zodBindings.add(local);
        if (path.node.source.value === "express") expressBindings.add(local);
        if (path.node.source.value === "jsonwebtoken") jwtBindings.add(local);
        if (path.node.source.value === "bcrypt" || path.node.source.value === "bcryptjs") bcryptBindings.add(local);
        if (path.node.source.value === "fs" || path.node.source.value === "node:fs" || path.node.source.value === "fs/promises") fsBindings.add(local);
        if (path.node.source.value === "react") {
          reactBindings.add(local);
          reactHookBindings.add(local);
        }
        if (["redux", "react-redux", "mobx", "mobx-react"].includes(path.node.source.value)) {
          stateBindings.add(local);
          stateOperationBindings.add(local);
        }
        if (["jest", "mocha", "chai", "vitest"].includes(path.node.source.value)) {
          testBindings.add(local);
          testOperationBindings.add(local);
        }
      }
    },
    CallExpression(path) {
      const call = path.node;
      if (call.callee.type !== "Identifier" || call.callee.name !== "require") return;
      const source = call.arguments[0]?.value;
      const local = path.parentPath?.node?.type === "VariableDeclarator"
        ? path.parentPath.node.id?.name
        : null;
      if (!source || !local) return;
      if (source === "express") expressBindings.add(local);
      if (databaseImports.has(source) || /(^|\/)models?(\/|$)/i.test(source)) {
        databaseBindings.add(local);
        databaseConstructors.add(local);
      }
    },
    VariableDeclarator(path) {
      if (path.node.id.type !== "Identifier") return;
      const init = path.node.init;
      if (init?.type === "NewExpression" && init.callee.type === "Identifier" && databaseConstructors.has(init.callee.name)) {
        databaseBindings.add(path.node.id.name);
      }
      if (init?.type === "MemberExpression" && databaseBindings.has(getRootIdentifier(init))) {
        databaseBindings.add(path.node.id.name);
      }
      if (init?.type === "CallExpression" && expressBindings.has(getRootIdentifier(init))) {
        expressInstances.add(path.node.id.name);
      }
      if (init?.type === "CallExpression" && init.callee.type === "MemberExpression" && expressBindings.has(getRootIdentifier(init.callee))) {
        expressInstances.add(path.node.id.name);
      }
      if (init?.type === "Identifier" && zodBindings.has(init.name)) {
        zodBindings.add(path.node.id.name);
      }
      if (init?.type === "CallExpression" && zodBindings.has(getRootIdentifier(init))) {
        zodBindings.add(path.node.id.name);
      }
    }
  });
  return { databaseBindings, prismaBindings, zodBindings, expressInstances, jwtBindings, bcryptBindings, fsBindings, reactBindings, reactHookBindings, stateBindings, stateOperationBindings, testBindings, testOperationBindings };
}
function getJSXName(node) { return node.type === "JSXIdentifier" ? node.name : node.type === "JSXMemberExpression" ? getJSXName(node.property) : null; }
function hasPathPart(path, term) { return path.split("/").some(part => part.includes(term)); }
function toArray(value) { return Array.isArray(value) ? value : value ? [value] : []; }
function decodeManifest(item) { return Buffer.from(item.content, "base64").toString("utf-8"); }
function extractNodeSignals(item, projectSignals) { const pkg = JSON.parse(decodeManifest(item)); const deps = { ...pkg.dependencies, ...pkg.devDependencies }; projectSignals.runtime.add("Node.js"); if (deps.react) projectSignals.frameworks.add("React"); if (deps.next) projectSignals.frameworks.add("NextJS"); if (deps.express) projectSignals.frameworks.add("Express"); if (deps["@nestjs/core"]) projectSignals.frameworks.add("NestJS"); if (deps.redux) projectSignals.frameworks.add("Redux"); if (deps["react-router-dom"] || deps["react-router"]) projectSignals.frameworks.add("React Router"); if (deps.mongoose) projectSignals.databases.add("MongoDB"); if (deps.pg) projectSignals.databases.add("PostgreSQL"); if (deps.mysql2) projectSignals.databases.add("MySQL"); if (deps.redis) projectSignals.databases.add("Redis"); if (deps.prisma) projectSignals.flags.add("Prisma"); }
function extractPythonSignals(item, projectSignals) { const dependencies = decodeManifest(item).split("\n").map(line => line.replace(/[#;].*$/, "").trim()).map(line => line.replace(/^["']|["'],?$/g, "")).map(line => line.split(/[>=<~!]/)[0].trim().toLowerCase()).filter(Boolean); projectSignals.runtime.add("Python"); if (dependencies.some(dep => ["tensorflow", "torch", "scikit-learn", "keras", "xgboost", "lightgbm", "catboost", "pytorch", "numpy", "pandas"].includes(dep))) projectSignals.flags.add("ML/AI"); if (dependencies.includes("django")) projectSignals.frameworks.add("Django"); if (dependencies.includes("flask")) projectSignals.frameworks.add("Flask"); if (dependencies.includes("fastapi")) projectSignals.frameworks.add("FastAPI"); if (dependencies.includes("sqlalchemy")) projectSignals.databases.add("PostgreSQL"); if (dependencies.includes("mysql-connector-python")) projectSignals.databases.add("MySQL"); if (dependencies.includes("pymongo")) projectSignals.databases.add("MongoDB"); if (dependencies.includes("redis")) projectSignals.databases.add("Redis"); }
function extractJavaSignals(item, projectSignals) { const content = decodeManifest(item).toLowerCase(); projectSignals.runtime.add("JVM"); if (content.includes("spring-boot")) { projectSignals.frameworks.add("Spring Boot"); projectSignals.flags.add("rest"); } if (content.includes("springframework")) projectSignals.frameworks.add("Spring Framework"); if (content.includes("hibernate")) { projectSignals.frameworks.add("Hibernate"); projectSignals.flags.add("orm"); } if (content.includes("micronaut")) projectSignals.frameworks.add("Micronaut"); if (content.includes("quarkus")) projectSignals.frameworks.add("Quarkus"); if (content.includes("react")) projectSignals.frameworks.add("React"); if (content.includes("angular")) projectSignals.frameworks.add("Angular"); if (content.includes("vue")) projectSignals.frameworks.add("Vue"); if (content.includes("postgresql")) projectSignals.databases.add("PostgreSQL"); if (content.includes("mysql")) projectSignals.databases.add("MySQL"); if (content.includes("mongodb")) projectSignals.databases.add("MongoDB"); if (content.includes("redis")) projectSignals.databases.add("Redis"); }
function extractCppSignals(item, projectSignals) { const content = decodeManifest(item); projectSignals.runtime.add("C++"); if (/find_package\s*\(\s*Boost/i.test(content)) projectSignals.frameworks.add("Boost"); if (/find_package\s*\(\s*(Qt5|Qt)/i.test(content)) projectSignals.frameworks.add("Qt"); if (/find_package\s*\(\s*Eigen3/i.test(content)) projectSignals.frameworks.add("Eigen"); if (/find_package\s*\(\s*Boost_asio/i.test(content)) projectSignals.frameworks.add("Boost.Asio"); if (/find_package\s*\(\s*SQLite3/i.test(content)) projectSignals.databases.add("SQLite"); if (/find_package\s*\(\s*PostgreSQL/i.test(content)) projectSignals.databases.add("PostgreSQL"); if (/find_package\s*\(\s*MySQL/i.test(content)) projectSignals.databases.add("MySQL"); if (/find_package\s*\(\s*MongoDB/i.test(content)) projectSignals.databases.add("MongoDB"); if (/find_package\s*\(\s*Redis/i.test(content)) projectSignals.databases.add("Redis"); if (/find_package\s*\(\s*OpenSSL/i.test(content)) projectSignals.frameworks.add("OpenSSL"); if (/find_package\s*\(\s*ZLIB/i.test(content)) projectSignals.frameworks.add("ZLIB"); }
