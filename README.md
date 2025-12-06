# Java Code Analyzer - Backend API

A powerful Node.js backend service for analyzing Java code with support for cyclomatic complexity analysis, deprecated API detection, modernization suggestions, and code formatting.

## Features

- **Code Formatting**: Automatic Java code formatting with proper indentation, spacing, and brace placement
- **Cyclomatic Complexity Analysis**: Calculate complexity scores for entire codebase and individual methods
- **Deprecated API Detection**: Identify usage of deprecated Java APIs with severity levels and replacement suggestions
- **Modernization Opportunities**: Detect opportunities to use modern Java features (Java 14-21)
- **File Upload Support**: Upload .java files for analysis
- **RESTful API**: Clean REST endpoints for easy integration

## Architecture

```
/backend
├── routes/              # API route definitions
├── controllers/         # Request handlers and orchestration
├── services/           # Core business logic
│   ├── formatter.service.js
│   ├── complexity.service.js
│   ├── deprecated.service.js
│   ├── modernization.service.js
│   └── extractMethods.service.js
├── utils/              # Helper utilities
│   ├── regex.utils.js
│   └── helper.utils.js
├── data/               # Static data and registries
├── app.js              # Express app configuration
└── server.js           # Server entry point
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=*
```

## Running the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### 1. Health Check

```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "status": "healthy",
  "service": "Java Code Analyzer API",
  "version": "1.0.0"
}
```

### 2. Analyze Java Code

```http
POST /api/analyze
Content-Type: application/json

{
  "code": "public class Example { ... }"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "formattedCode": "formatted code here",
    "complexity": {
      "overall": 15,
      "average": 5,
      "highest": { "name": "processData", "score": 8 },
      "methods": [...],
      "rating": { "rating": "Moderate", "color": "yellow" }
    },
    "deprecated": {
      "total": 2,
      "high": 1,
      "medium": 1,
      "low": 0,
      "details": [...]
    },
    "modernization": {
      "totalOpportunities": 5,
      "modernizationScore": 75,
      "topRecommendations": [...]
    },
    "metrics": {
      "totalLines": 150,
      "totalMethods": 5,
      "averageMethodLength": 20
    }
  }
}
```

### 3. Format Code Only

```http
POST /api/format
Content-Type: application/json

{
  "code": "public class Example { ... }"
}
```

### 4. Upload and Analyze File

```http
POST /api/analyze/upload
Content-Type: multipart/form-data

file: example.java
```

## Complexity Rating System

| Score | Rating | Risk Level |
|-------|--------|------------|
| 1-5 | Low | Low risk |
| 6-10 | Moderate | Medium risk |
| 11-20 | High | High risk |
| 21+ | Very High | Very high risk |

## Deprecated APIs Detected

- Thread.stop(), Thread.suspend(), Thread.resume()
- Date.getYear(), Date.setYear()
- Vector, Hashtable, Stack
- Observer/Observable
- StringBuffer (when StringBuilder is better)
- SecurityManager

## Modernization Features Detected

- Switch expressions (Java 14+)
- Records (Java 16+)
- Virtual threads (Java 21)
- Pattern matching
- Type inference with var (Java 10+)
- Text blocks (Java 15+)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## Sample Request with cURL

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "public class Test { public static void main(String[] args) { System.out.println(\"Hello\"); } }"
  }'
```

## Frontend Integration Example

```javascript
const analyzeCode = async (code) => {
  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const result = await response.json();
  return result;
};
```

## File Upload Example

```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5000/api/analyze/upload', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **File Upload**: Multer
- **CORS**: cors middleware

## License

MIT
