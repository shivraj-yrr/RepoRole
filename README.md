RepoRole — Repository to Role Analyzer

RepoRole analyzes a GitHub repository and predicts suitable software-development roles from evidence found in the codebase.

No resume. No form. Just code → evidence → capabilities → roles.

Live Links

Live Demo: https://repo-role.vercel.app/

Backend API: https://reposense.onrender.com/

The backend currently exposes POST /analyze/roles. POST /analyze/your-roles is retained as a compatibility alias.

What RepoRole Does

RepoRole inspects a repository's structure, manifests, and sampled source files to identify technical signals. Those signals are converted into established capabilities and then scored against configured role profiles.

GitHub repository
       ↓
Repository metadata + structure + manifests
       ↓
File classification + sampling
       ↓
AST / source analysis
       ↓
Detailed technical signals
       ↓
Capability normalization + evidence gates
       ↓
Role scoring + confidence
       ↓
Top role matches

The analyzer is evidence-driven: role scoring consumes capabilities already established by the normalizer rather than parsing source code itself.

Current Features

GitHub repository analysis from a repository URL

JavaScript / JSX / TypeScript / TSX AST parsing with Babel

Python and Java source scanning

Manifest analysis for common ecosystem/build files

File classification and bounded source-file sampling

Fine-grained technical signal extraction

Evidence strength levels: invalid, weak, medium, strong

Capability normalization with explicit evidence requirements

Candidate signals for partial evidence that does not satisfy a capability gate

Role-oriented scoring with configurable capability weights

Required vs essential capability gates

Partial eligibility with penalties for missing non-essential requirements

Capability depth bonuses for repeated and distributed evidence

Role synergy bonuses

Repository-side scoping for frontend/backend/full-stack role scoring in detected multi-root structures

Toy-project detection and conservative scoring

Top-three role ranking

Confidence based on capability coverage

Redis caching with fallback when Redis is unavailable

In-flight request deduplication in the analysis orchestrator

GitHub API rate-limit mitigation through caching

JWT-based authenticated access control for role analysis

GitHub ownership checks for seeker analysis

Anonymous analysis requests remain supported subject to rate limits

Role Profiles

Current configured role profiles are:

Backend JavaScript Developer

Full Stack JavaScript Developer

Frontend Developer

Python Backend Developer

Java Backend Developer

DevOps Engineer (Entry)

Role profiles are configuration contracts. They define the capabilities and minimum evidence strength expected for a role; they do not inspect source code or implement the detection rules themselves.

Capability Model

The current capability catalog includes:

REST API routing

HTTP middleware

Database management

Token authentication

Password security

Input validation

State management

Automated testing

Error handling

Continuous integration configuration

Container configuration

Python backend development

Java backend development

A capability is not awarded merely because a filename, dependency, generic method name, or occurrence count looks relevant. The normalizer uses explicitly named raw signals and evidence gates.

Evidence Model

Raw detector output retains file-level evidence such as:

file path

line / location information when available

source type

evidence strength

signal-specific context

The normalizer turns detailed signals into established capabilities only when their aggregation rules are satisfied. Failed gates can remain available as candidate evidence for explanation without influencing scoring.

Scoring Model

Role scoring is based on established capabilities only.

Each role defines:

capability points

minimum evidence strength

required capabilities

essential capabilities

role side (frontend, backend, both, or repository-level)

The scorer also considers:

capability depth and distribution

role synergies

missing non-essential required capabilities

toy-project restrictions

capability coverage for confidence

Final scores are normalized to a maximum of 100. Depth and synergy bonuses cannot push the displayed final score above that ceiling.

Important distinction

Raw signal ≠ capability ≠ role

A detected signal is not automatically a role capability, and a capability is not automatically proof of a particular role.

Repository Scanning

The scanner currently considers:

.js  .jsx  .ts  .tsx  .py  .java

It ignores common generated/dependency/build paths such as:

.git
node_modules
dist
build
coverage
.next
.nuxt
vendor
fixtures
flow-typed
bench

Files are classified into categories such as entrypoints, routes, controllers, services, middleware, models, authentication, configuration, stores, components, pages, utilities, tests, and other source files.

Sampling is bounded by category and directory so large repositories do not require downloading and parsing every source file.

JavaScript / TypeScript files are parsed into Babel ASTs. Python and Java files are currently passed through for language-specific signal handling.

Monorepos and Repository Structure

RepoRole uses repository structure as supporting context. When a repository exposes recognizable frontend and backend roots, role scoring can scope evidence to the relevant side for frontend, backend, and full-stack roles.

This is a safety mechanism, not the source of technical capabilities. The underlying evidence still comes from the scanner and signal pipeline.

Backend Architecture

Backend/
├── jobs.js
├── package.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── cache/
│   ├── config/
│   ├── controllers/
│   ├── engines/
│   │   └── scoring.engine.js
│   ├── middlewares/
│   ├── orchestrators/
│   ├── roles/
│   ├── routes/
│   ├── services/
│   │   ├── analyze.service.js
│   │   ├── github.service.js
│   │   ├── scanner.service.js
│   │   ├── signal.service.js
│   │   ├── signal.normalizer.js
│   │   └── toyDetector.js
│   └── utils/
└── index.html / style.css / script.js

Responsibilities

server.js — starts the HTTP server.

app.js — configures middleware and mounts application routes.

routes/ — exposes analysis and authentication endpoints.

controllers/ — validates requests and coordinates responses.

orchestrators/ — coordinates repository analysis, caching, and request deduplication.

services/github.service.js — GitHub API access.

services/scanner.service.js — file classification, bounded sampling, source retrieval, and AST parsing.

services/signal.service.js — detailed technical signal extraction.

services/signal.normalizer.js — converts raw signals into established capabilities using explicit evidence rules.

engines/scoring.engine.js — ranks configured roles from normalized capabilities.

roles/ / jobs.js — role configuration and capability contracts.

cache/redis.js — optional Redis integration.

middlewares/ — authentication/access control, rate limiting, and error handling.

Design rule: Parsing, signal extraction, normalization, and scoring are separate responsibilities.

Frontend

The web application is built with:

React 19

Redux Toolkit

Vite 7

Tailwind CSS 4

Axios

The frontend consumes the backend analysis response and presents repository signals, role matches, scores, confidence, and supporting analysis data.

API

Analyze repository roles

POST /analyze/roles
Content-Type: application/json

Request:

{
  "repo": "https://github.com/facebook/react"
}

Compatibility endpoint:

POST /analyze/your-roles

Analysis response

The response can contain:

repository metadata

detected languages/runtime/frameworks/databases

repository structure

build files and flags

toy-project and monorepo state

detailedSignals — raw detector evidence

roleSignals — established capabilities used for scoring

candidateSignals — partial capability evidence that failed a gate

unmappedSignals — detailed signals not consumed by a capability rule

roles — ranked eligible role matches

selectedFiles — files selected for source analysis

Authentication and Access

Role analysis supports anonymous requests, subject to the configured rate limit.

Authenticated access supports JWT tokens supplied through a cookie or Bearer authorization header. Seekers authenticated through GitHub are restricted to repositories owned by their GitHub account. Recruiters and the configured admin account can access role analysis according to the current access middleware.

Caching and Request Deduplication

Redis is optional.

When available, Redis reduces repeated GitHub API calls and improves response performance. When Redis is unavailable, the analyzer continues through its fallback path.

The analysis orchestrator also deduplicates identical in-flight analysis requests so concurrent requests for the same repository do not unnecessarily repeat the same work.

Local Development

Backend

cd Backend
npm install
npm run dev

Or:

node src/server.js

Frontend

cd Frontend
npm install
npm run dev

Environment Variables

Backend

GITHUB_TOKEN=your_github_token
GITHUB_API_BASE_URL=https://api.github.com
REDIS_URL=redis://localhost:6379
PORT=3000
JWT_SECRET=your_jwt_secret
ADMIN_GITHUB_LOGIN=your_admin_github_login

Use the variables required by the current authentication/database configuration when running the complete application locally.

Frontend

VITE_API_BASE_URL=http://localhost:3000

Testing

The backend includes scoring contract tests covering areas such as:

essential capability gates

partial eligibility for missing non-essential requirements

final-score ceiling enforcement

repeated-evidence scoring behaviour

multi-role ranking

frontend/backend evidence scoping in multi-root structures

Current Scope

Public GitHub repository analysis is the primary V1 analysis flow.

Repository source analysis is bounded through file classification and sampling.

Monorepo and multi-root handling is conservative.

Role profiles and capability rules are configuration-driven and focused on entry-level/intern role matching.

The analyzer is deterministic and evidence-driven; it does not use an LLM to decide the role score.

License

This project is licensed under the MIT License. See the LICENSE file for details.