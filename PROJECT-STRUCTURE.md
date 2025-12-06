# Project Structure

```
java-code-analyzer-backend/
│
├── controllers/
│   └── analyze.controller.js          # Main controller - orchestrates all services
│
├── services/                           # Core business logic
│   ├── complexity.service.js          # Cyclomatic complexity calculation
│   ├── deprecated.service.js          # Deprecated API detection
│   ├── extractMethods.service.js      # Java method extraction and parsing
│   ├── formatter.service.js           # Code formatting logic
│   └── modernization.service.js       # Java modernization opportunities detection
│
├── routes/
│   └── analyze.routes.js              # API route definitions
│
├── utils/                              # Helper utilities
│   ├── helper.utils.js                # General helper functions
│   └── regex.utils.js                 # Regex patterns and utilities
│
├── data/
│   └── deprecated-registry.json       # Registry of deprecated Java APIs
│
├── test/
│   ├── sample.java                    # Sample Java code for testing
│   └── test-api.js                    # API test suite
│
├── .env                                # Environment variables
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── app.js                              # Express app configuration
├── server.js                           # Server entry point
├── package.json                        # Project dependencies and scripts
├── README.md                           # Full documentation
├── API-GUIDE.md                        # Quick API reference
└── PROJECT-STRUCTURE.md                # This file
```

## File Responsibilities

### Controllers (`controllers/`)
- **analyze.controller.js**
  - Receives HTTP requests
  - Validates input
  - Orchestrates service calls
  - Formats responses
  - Handles errors

### Services (`services/`)

#### formatter.service.js
- Normalizes code formatting
- Fixes braces and spacing
- Adds missing semicolons
- Handles indentation
- Removes extra whitespace

#### complexity.service.js
- Calculates cyclomatic complexity
- Analyzes control flow structures
- Generates complexity ratings
- Identifies complex methods
- Provides refactoring recommendations

#### extractMethods.service.js
- Parses Java code structure
- Extracts method definitions
- Finds method bodies
- Counts method lines
- Handles multi-line methods

#### deprecated.service.js
- Scans for deprecated APIs
- Matches against registry
- Categorizes by severity
- Provides replacement suggestions
- Generates summary reports

#### modernization.service.js
- Detects modernization opportunities
- Identifies Java 14-21 feature candidates
- Calculates modernization score
- Prioritizes recommendations
- Provides code examples

### Routes (`routes/`)
- **analyze.routes.js**
  - POST /api/analyze - Full code analysis
  - POST /api/format - Code formatting only
  - POST /api/analyze/upload - File upload
  - GET /api/health - Health check

### Utils (`utils/`)

#### regex.utils.js
- Java keyword patterns
- Control flow detection patterns
- Deprecated API patterns
- Modernization patterns
- Method signature regex
- Comment removal utilities

#### helper.utils.js
- String manipulation
- Line counting
- Whitespace handling
- Code validation
- General utilities

### Data (`data/`)
- **deprecated-registry.json**
  - Comprehensive list of deprecated APIs
  - Replacement suggestions
  - Severity levels
  - Code examples

### Configuration Files

#### app.js
- Express app setup
- Middleware configuration
- CORS setup
- Route mounting
- Error handling

#### server.js
- Server startup
- Port configuration
- Graceful shutdown
- Process signal handling
- Error logging

#### package.json
- Project metadata
- Dependencies
- Scripts
- Version info

## Data Flow

```
Client Request
      ↓
Express Middleware (CORS, JSON parsing)
      ↓
Routes (analyze.routes.js)
      ↓
Controller (analyze.controller.js)
      ↓
┌─────────────────────────────────────┐
│   Services (Parallel Processing)   │
│                                     │
│  • Formatter                        │
│  • Complexity Calculator            │
│  • Deprecated Detector              │
│  • Modernization Analyzer           │
│  • Method Extractor                 │
└─────────────────────────────────────┘
      ↓
Controller (aggregate results)
      ↓
JSON Response
      ↓
Client
```

## Service Dependencies

```
analyze.controller.js
  ├─→ formatter.service.js
  │     └─→ helper.utils.js
  │
  ├─→ complexity.service.js
  │     ├─→ extractMethods.service.js
  │     │     ├─→ regex.utils.js
  │     │     └─→ helper.utils.js
  │     └─→ regex.utils.js
  │
  ├─→ deprecated.service.js
  │     └─→ regex.utils.js
  │
  └─→ modernization.service.js
        └─→ regex.utils.js
```

## Key Design Principles

1. **Separation of Concerns**
   - Routes handle HTTP
   - Controllers orchestrate
   - Services contain business logic
   - Utils provide reusable helpers

2. **Single Responsibility**
   - Each service has one clear purpose
   - Each utility function does one thing
   - Each route maps to one operation

3. **Modularity**
   - Services are independent
   - Easy to test in isolation
   - Easy to extend or replace

4. **Scalability**
   - Clean architecture supports growth
   - Easy to add new analysis features
   - Can parallelize service calls

5. **Maintainability**
   - Clear file organization
   - Consistent naming conventions
   - Comprehensive documentation
