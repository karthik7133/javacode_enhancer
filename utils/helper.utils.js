function cleanWhitespace(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function normalizeLineEndings(str) {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function countOccurrences(str, pattern) {
  if (typeof pattern === 'string') {
    return (str.match(new RegExp(pattern, 'g')) || []).length;
  }
  return (str.match(pattern) || []).length;
}

function extractLines(code, startLine, endLine) {
  const lines = code.split('\n');
  return lines.slice(startLine - 1, endLine).join('\n');
}

function getLineNumber(code, index) {
  return code.substring(0, index).split('\n').length;
}

function isValidJavaCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const hasClassOrInterface = /\b(class|interface|enum)\s+\w+/.test(code);
  const hasBraces = code.includes('{') && code.includes('}');

  return hasClassOrInterface || hasBraces;
}

function sanitizeInput(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.trim();
}

function formatMethodName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

function extractBetween(str, start, end) {
  const startIndex = str.indexOf(start);
  if (startIndex === -1) return null;

  const endIndex = str.indexOf(end, startIndex + start.length);
  if (endIndex === -1) return null;

  return str.substring(startIndex + start.length, endIndex);
}

function findMatchingBrace(code, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

module.exports = {
  cleanWhitespace,
  normalizeLineEndings,
  countOccurrences,
  extractLines,
  getLineNumber,
  isValidJavaCode,
  sanitizeInput,
  formatMethodName,
  calculatePercentage,
  capitalizeFirstLetter,
  truncateString,
  extractBetween,
  findMatchingBrace
};
