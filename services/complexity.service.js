const { extractMethods, getMethodBody } = require("./extractMethods.service");
const {
  CONTROL_FLOW_PATTERNS,
  removeComments,
} = require("../utils/regex.utils");
const { countOccurrences } = require("../utils/helper.utils");

function calculateComplexity(code) {
  if (!code || typeof code !== "string") {
    return {
      overall: 1,
      methods: [],
      average: 1,
      highest: { name: "N/A", score: 1 },
    };
  }

  const cleanedCode = removeComments(code);
  const methods = extractMethods(cleanedCode);

  if (methods.length === 0) {
    const overallScore = calculateCodeComplexity(cleanedCode);
    return {
      overall: overallScore,
      methods: [],
      average: overallScore,
      highest: { name: "Overall", score: overallScore },
    };
  }

  const methodComplexities = methods.map((method) => {
    const methodBody = getMethodBody(method.code);
    const complexity = calculateCodeComplexity(methodBody);

    return {
      name: method.name,
      complexity: complexity,
      lines: method.code.split("\n").length,
    };
  });

  const totalComplexity = methodComplexities.reduce(
    (sum, m) => sum + m.complexity,
    0
  );
  const averageComplexity = Math.round(
    totalComplexity / methodComplexities.length
  );

  const highestComplexity = methodComplexities.reduce((max, m) =>
    m.complexity > max.complexity ? m : max
  );

  return {
    overall: totalComplexity,
    methods: methodComplexities,
    average: averageComplexity,
    highest: {
      name: highestComplexity.name,
      score: highestComplexity.complexity,
    },
  };
}

function calculateCodeComplexity(code) {
  let complexity = 1;

  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.if);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.elseIf);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.for);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.while);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.doWhile);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.case);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.catch);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.ternary);

  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.logicalAnd);
  complexity += countOccurrences(code, CONTROL_FLOW_PATTERNS.logicalOr);

  return complexity;
}

function getComplexityRating(score) {
  if (score <= 5) return { rating: "Low", color: "green", risk: "Low risk" };
  if (score <= 10)
    return { rating: "Moderate", color: "yellow", risk: "Medium risk" };
  if (score <= 20)
    return { rating: "High", color: "orange", risk: "High risk" };
  return { rating: "Very High", color: "red", risk: "Very high risk" };
}

function analyzeComplexityTrends(methods) {
  const sorted = [...methods].sort((a, b) => b.complexity - a.complexity);

  return {
    topComplex: sorted.slice(0, 5),
    needsRefactoring: sorted.filter((m) => m.complexity > 10),
    simple: sorted.filter((m) => m.complexity <= 5).length,
    moderate: sorted.filter((m) => m.complexity > 5 && m.complexity <= 10)
      .length,
    complex: sorted.filter((m) => m.complexity > 10).length,
  };
}

module.exports = {
  calculateComplexity,
  calculateCodeComplexity,
  getComplexityRating,
  analyzeComplexityTrends,
};
