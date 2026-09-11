/**
 * Role cards are the product contract. They name capabilities and the
 * minimum evidence quality needed for a role match; they do not inspect code
 * or implement scoring behaviour.
 */
export const CAPABILITY_CATALOG = Object.freeze({
  express_routing: "REST API routing",
  express_middleware: "HTTP middleware",
  database_management: "Database management",
  token_authentication: "Token authentication",
  password_security: "Password security",
  input_validation: "Input validation",
  state_management: "State management",
  testing: "Automated testing",
  error_handling: "Error handling",
  ci_configuration: "Continuous integration configuration",
  container_configuration: "Container configuration",
  python_backend: "Python backend development",
  java_backend: "Java backend development"
});

const capability = (id, points, minimumStrength, required = false) => ({
  id,
  points,
  minimumStrength,
  required
});

const jobs = [
  {
    id: "backend_javascript_developer",
    title: "Backend JavaScript Developer",
    level: "intern",
    capabilities: [
      capability("express_routing", 15, 3, true),
      capability("express_middleware", 10, 3),
      capability("database_management", 20, 3, true),
      capability("token_authentication", 15, 2),
      capability("password_security", 10, 2),
      capability("input_validation", 10, 2),
      capability("testing", 10, 2),
      capability("error_handling", 5, 2),
      capability("ci_configuration", 5, 1),
      capability("container_configuration", 5, 1)
    ]
  },
  {
    id: "fullstack_javascript_developer",
    title: "Full Stack JavaScript Developer",
    level: "intern",
    capabilities: [
      capability("express_routing", 20, 3, true),
      capability("database_management", 15, 3, true),
      capability("token_authentication", 10, 2),
      capability("input_validation", 10, 2),
      capability("state_management", 20, 2, true),
      capability("testing", 10, 2),
      capability("error_handling", 5, 2),
      capability("ci_configuration", 5, 1),
      capability("container_configuration", 5, 1)
    ]
  },
  {
    id: "frontend_developer",
    title: "Frontend Developer",
    level: "intern",
    capabilities: [
      capability("state_management", 25, 2, true),
      capability("testing", 20, 2),
      capability("error_handling", 10, 2),
      capability("ci_configuration", 5, 1),
      capability("container_configuration", 5, 1)
    ]
  },
  {
    id: "python_backend_developer",
    title: "Python Backend Developer",
    level: "intern",
    capabilities: [
      capability("python_backend", 30, 3, true),
      capability("database_management", 20, 3, true),
      capability("input_validation", 15, 2),
      capability("testing", 15, 2),
      capability("ci_configuration", 10, 1),
      capability("container_configuration", 10, 1)
    ]
  },
  {
    id: "java_backend_developer",
    title: "Java Backend Developer",
    level: "intern",
    capabilities: [
      capability("java_backend", 30, 3, true),
      capability("database_management", 20, 3, true),
      capability("testing", 15, 2),
      capability("error_handling", 10, 2),
      capability("ci_configuration", 10, 1),
      capability("container_configuration", 10, 1)
    ]
  },
  {
    id: "devops_engineer",
    title: "DevOps Engineer (Entry)",
    level: "intern",
    capabilities: [
      capability("ci_configuration", 40, 1, true),
      capability("container_configuration", 40, 1, true),
      capability("testing", 20, 2)
    ]
  }
];

export default jobs;
