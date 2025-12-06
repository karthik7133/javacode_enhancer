# Java Code Analyzer API - Quick Start Guide

## Starting the Server

```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints Overview

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Analyze Code
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "public class Test { public static void main(String[] args) { } }"}'
```

### 3. Format Code
```bash
curl -X POST http://localhost:5000/api/format \
  -H "Content-Type: application/json" \
  -d '{"code": "public class Test{void method(){if(x>0){}}}"}'
```

### 4. Upload File
```bash
curl -X POST http://localhost:5000/api/analyze/upload \
  -F "file=@./test/sample.java"
```

## Response Structure

### Successful Analysis Response
```json
{
  "success": true,
  "data": {
    "formattedCode": "...",
    "complexity": {
      "overall": 15,
      "average": 5,
      "highest": {
        "name": "calculateComplexity",
        "score": 8
      },
      "methods": [
        {
          "name": "processData",
          "complexity": 5,
          "lines": 12
        }
      ],
      "trends": {
        "topComplex": [...],
        "needsRefactoring": [...],
        "simple": 3,
        "moderate": 2,
        "complex": 1
      },
      "rating": {
        "rating": "Moderate",
        "color": "yellow",
        "risk": "Medium risk"
      }
    },
    "deprecated": {
      "total": 4,
      "high": 1,
      "medium": 2,
      "low": 1,
      "details": [
        {
          "api": "Thread.stop()",
          "message": "Thread.stop() is deprecated",
          "suggestion": "Use interrupt() or a flag-based approach instead",
          "severity": "high",
          "line": 24,
          "code": "thread.stop()"
        }
      ]
    },
    "modernization": {
      "totalOpportunities": 5,
      "totalOccurrences": 12,
      "highPriority": 2,
      "mediumPriority": 2,
      "lowPriority": 1,
      "modernizationScore": 75,
      "topRecommendations": [
        {
          "category": "Virtual Threads",
          "message": "Traditional thread creation detected",
          "suggestion": "Consider using Java 21 Virtual Threads for better scalability",
          "modernFeature": "Virtual Threads (Java 21)",
          "example": "Thread.startVirtualThread(() -> { })",
          "priority": "high",
          "occurrences": 2,
          "lines": [24, 35]
        }
      ]
    },
    "metrics": {
      "totalLines": 65,
      "totalMethods": 5,
      "averageMethodLength": 13
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid input",
  "message": "Code is required and must be a string"
}
```

## Using with Frontend (React/JavaScript)

```javascript
const analyzeJavaCode = async (code) => {
  try {
    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Complexity:', result.data.complexity);
      console.log('Deprecated APIs:', result.data.deprecated);
      console.log('Modernization Score:', result.data.modernization.modernizationScore);
    }

    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
};
```

## File Upload Example (React)

```javascript
const uploadJavaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5000/api/analyze/upload', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};
```

## Testing the API

Run the test suite:

```bash
node test/test-api.js
```

Make sure the server is running before executing tests.

## Complexity Rating Guide

| Score Range | Rating | Color | Risk Level | Recommendation |
|-------------|--------|-------|------------|----------------|
| 1-5 | Low | Green | Low risk | Well-structured code |
| 6-10 | Moderate | Yellow | Medium risk | Consider simplification |
| 11-20 | High | Orange | High risk | Refactoring recommended |
| 21+ | Very High | Red | Very high risk | Immediate refactoring needed |

## Common Issues

### CORS Errors
If you get CORS errors from frontend:
- Ensure CORS_ORIGIN is set correctly in .env
- For development, use CORS_ORIGIN=*

### File Upload Errors
- Max file size: 5MB
- Accepted file types: .java files only
- Ensure file content is valid UTF-8

### Invalid Code Errors
- Code must contain valid Java syntax
- Must have at least class/interface/enum declaration or braces

## Integration Tips

1. Always check `success` field in response
2. Handle errors gracefully with try-catch
3. Display complexity rating with appropriate colors
4. Show deprecated APIs with severity indicators
5. Highlight high-priority modernization opportunities first
6. Use formatted code for display purposes

## Performance Notes

- Average response time: 50-200ms for typical code
- Large files (>1000 lines): 200-500ms
- File upload adds minimal overhead (10-20ms)
