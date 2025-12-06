const { MODERNIZATION_PATTERNS, removeComments, findPatternMatches } = require('../utils/regex.utils');
const { getLineNumber } = require('../utils/helper.utils');

function getModernizationOpportunities(code) {
  if (!code || typeof code !== 'string') {
    return [];
  }

  const cleanedCode = removeComments(code);
  const opportunities = [];

  const modernizationChecks = {
    'Switch Expression': {
      pattern: MODERNIZATION_PATTERNS.switchStatement,
      message: 'Traditional switch with break statements detected',
      suggestion: 'Consider using Java 14+ switch expressions for cleaner code',
      modernFeature: 'Switch Expressions (Java 14+)',
      example: 'return switch(value) { case A -> result1; case B -> result2; };',
      priority: 'medium'
    },
    'StringBuilder': {
      pattern: MODERNIZATION_PATTERNS.stringBuffer,
      message: 'StringBuffer usage detected',
      suggestion: 'Use StringBuilder for better performance in single-threaded contexts',
      modernFeature: 'StringBuilder',
      example: 'StringBuilder sb = new StringBuilder();',
      priority: 'low'
    },
    'Enhanced For Loop': {
      pattern: MODERNIZATION_PATTERNS.enhancedForLoop,
      message: 'Traditional for loop with index detected',
      suggestion: 'Consider using enhanced for-each loop or Stream API',
      modernFeature: 'Enhanced For / Streams',
      example: 'for (Type item : collection) { } or collection.stream().forEach()',
      priority: 'low'
    },
    'Record Class': {
      pattern: MODERNIZATION_PATTERNS.classWithGettersSetters,
      message: 'Class with getters/setters detected',
      suggestion: 'Consider using Java 16+ record for immutable data carriers',
      modernFeature: 'Records (Java 16+)',
      example: 'public record Person(String name, int age) {}',
      priority: 'high'
    },
    'Virtual Threads': {
      pattern: MODERNIZATION_PATTERNS.threadCreation,
      message: 'Traditional thread creation detected',
      suggestion: 'Consider using Java 21 Virtual Threads for better scalability',
      modernFeature: 'Virtual Threads (Java 21)',
      example: 'Thread.startVirtualThread(() -> { })',
      priority: 'high'
    },
    'Pattern Matching': {
      pattern: MODERNIZATION_PATTERNS.nullCheck,
      message: 'Traditional null check detected',
      suggestion: 'Consider using pattern matching or Optional',
      modernFeature: 'Pattern Matching / Optional',
      example: 'Optional.ofNullable(value).ifPresent()',
      priority: 'medium'
    },
    'Type Inference (var)': {
      pattern: MODERNIZATION_PATTERNS.typeDeclaration,
      message: 'Verbose type declaration detected',
      suggestion: 'Consider using var for local variable type inference (Java 10+)',
      modernFeature: 'Type Inference with var (Java 10+)',
      example: 'var list = new ArrayList<String>();',
      priority: 'low'
    }
  };

  for (const [name, config] of Object.entries(modernizationChecks)) {
    const matches = findPatternMatches(cleanedCode, config.pattern);

    if (matches.length > 0) {
      opportunities.push({
        category: name,
        message: config.message,
        suggestion: config.suggestion,
        modernFeature: config.modernFeature,
        example: config.example,
        priority: config.priority,
        occurrences: matches.length,
        lines: matches.map(m => m.line)
      });
    }
  }

  return opportunities;
}

function calculateModernizationScore(opportunities) {
  if (opportunities.length === 0) {
    return 100;
  }

  const priorityWeights = {
    high: 15,
    medium: 10,
    low: 5
  };

  const totalDeductions = opportunities.reduce((sum, opp) => {
    const weight = priorityWeights[opp.priority] || 5;
    return sum + (weight * Math.min(opp.occurrences, 3));
  }, 0);

  const score = Math.max(0, 100 - totalDeductions);
  return Math.round(score);
}

function prioritizeOpportunities(opportunities) {
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  return opportunities.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.occurrences - a.occurrences;
  });
}

function getModernizationSummary(opportunities) {
  const byPriority = {
    high: opportunities.filter(o => o.priority === 'high'),
    medium: opportunities.filter(o => o.priority === 'medium'),
    low: opportunities.filter(o => o.priority === 'low')
  };

  const totalOccurrences = opportunities.reduce((sum, o) => sum + o.occurrences, 0);

  return {
    totalOpportunities: opportunities.length,
    totalOccurrences: totalOccurrences,
    highPriority: byPriority.high.length,
    mediumPriority: byPriority.medium.length,
    lowPriority: byPriority.low.length,
    modernizationScore: calculateModernizationScore(opportunities),
    topRecommendations: prioritizeOpportunities(opportunities).slice(0, 5)
  };
}

module.exports = {
  getModernizationOpportunities,
  calculateModernizationScore,
  prioritizeOpportunities,
  getModernizationSummary
};
