const {
  DEPRECATED_PATTERNS,
  removeComments,
  findPatternMatches,
} = require("../utils/regex.utils");

function getDeprecatedApis(code) {
  if (!code || typeof code !== "string") {
    return [];
  }

  const cleanedCode = removeComments(code);
  const deprecatedIssues = [];

  /**
   * FULL UPDATED REGISTRY
   * ===============================================
   * Added:
   *  - Date.getMonth()
   *  - Date.getDay()
   *  - Thread.stop()
   *  - Applet.newAudioClip()
   *  - AudioClip.play()
   *  - System.getSecurityManager()
   *  - finalize()
   * ===============================================
   */
  const deprecatedRegistry = {
    "Thread.stop()": {
      pattern: /Thread\.stop\s*\(/g,
      message: "Thread.stop() is deprecated and unsafe.",
      suggestion: "Use interrupt() or a controlled stop flag.",
      severity: "high",
    },

    "Thread.suspend()": {
      pattern: /Thread\.suspend\s*\(/g,
      message: "Thread.suspend() is deprecated.",
      suggestion: "Use wait()/notify() or Locks.",
      severity: "high",
    },

    "Thread.resume()": {
      pattern: /Thread\.resume\s*\(/g,
      message: "Thread.resume() is deprecated.",
      suggestion: "Use wait()/notify() or Locks.",
      severity: "high",
    },

    "Date.getYear()": {
      pattern: /getYear\s*\(/g,
      message: "Date.getYear() is deprecated.",
      suggestion: "Use LocalDate.now().getYear() instead.",
      severity: "medium",
    },

    "Date.getMonth()": {
      pattern: /getMonth\s*\(/g,
      message: "Date.getMonth() is deprecated.",
      suggestion: "Use LocalDate.getMonthValue().",
      severity: "medium",
    },

    "Date.getDay()": {
      pattern: /getDay\s*\(/g,
      message: "Date.getDay() is deprecated.",
      suggestion: "Use LocalDate.getDayOfWeek().",
      severity: "medium",
    },

    "Applet.newAudioClip()": {
      pattern: /Applet\.newAudioClip/g,
      message:
        "Applet.newAudioClip() is deprecated and removed in modern Java.",
      suggestion: "Use javax.sound.sampled APIs.",
      severity: "high",
    },

    "AudioClip.play()": {
      pattern: /\.play\s*\(\)/g,
      message: "AudioClip.play() is deprecated.",
      suggestion: "Use javax.sound.sampled Clip API.",
      severity: "medium",
    },

    "System.getSecurityManager()": {
      pattern: /System\.getSecurityManager/g,
      message: "SecurityManager is deprecated for removal.",
      suggestion:
        "Do not rely on SecurityManager; use platform access control.",
      severity: "high",
    },

    "finalize() method": {
      pattern: /void\s+finalize\s*\(/g,
      message: "finalize() is deprecated for removal.",
      suggestion: "Use java.lang.ref.Cleaner or try-with-resources.",
      severity: "high",
    },

    // --- EXISTING MATCHERS YOU ALREADY HAD ---
    "Date.setYear()": {
      pattern: DEPRECATED_PATTERNS.dateSetYear,
      message: "Date.setYear() is deprecated.",
      suggestion: "Use LocalDate or Calendar.",
      severity: "medium",
    },

    "StringBuffer unnecessary": {
      pattern: DEPRECATED_PATTERNS.stringBufferConstructor,
      message: "StringBuffer may be unnecessary.",
      suggestion: "Use StringBuilder for performance.",
      severity: "low",
    },

    Vector: {
      pattern: DEPRECATED_PATTERNS.vectorUsage,
      message: "Vector is legacy.",
      suggestion: "Use ArrayList instead.",
      severity: "low",
    },

    Hashtable: {
      pattern: DEPRECATED_PATTERNS.hashtableUsage,
      message: "Hashtable is legacy.",
      suggestion: "Use HashMap instead.",
      severity: "low",
    },

    "Observer/Observable": {
      pattern: DEPRECATED_PATTERNS.observerObservable,
      message: "Observer/Observable is deprecated.",
      suggestion: "Use PropertyChangeListener or reactive APIs.",
      severity: "medium",
    },
  };

  // Scan every rule
  for (const [name, config] of Object.entries(deprecatedRegistry)) {
    const matches = findPatternMatches(cleanedCode, config.pattern);

    matches.forEach((match) => {
      deprecatedIssues.push({
        api: name,
        message: config.message,
        suggestion: config.suggestion,
        severity: config.severity,
        lineNumber: match.line,
        code: match.match.trim(),
      });
    });
  }

  return deprecatedIssues;
}

// Group by severity
function groupBySeverity(issues) {
  return {
    high: issues.filter((i) => i.severity === "high"),
    medium: issues.filter((i) => i.severity === "medium"),
    low: issues.filter((i) => i.severity === "low"),
  };
}

// Summary output
function getDeprecatedSummary(issues) {
  const grouped = groupBySeverity(issues);

  return {
    total: issues.length,
    high: grouped.high.length,
    medium: grouped.medium.length,
    low: grouped.low.length,
    details: issues,
  };
}

module.exports = {
  getDeprecatedApis,
  groupBySeverity,
  getDeprecatedSummary,
};
