const JAVA_KEYWORDS = [
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
  'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'void', 'volatile', 'while'
];

const COMPLEXITY_KEYWORDS = ['if', 'else', 'for', 'while', 'case', 'catch', 'throw', 'return'];

const METHOD_SIGNATURE_REGEX = /(public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(\{|throws)/g;

const COMMENT_REGEX = {
  singleLine: /\/\/.*/g,
  multiLine: /\/\*[\s\S]*?\*\//g
};

const CONTROL_FLOW_PATTERNS = {
  if: /\bif\s*\(/g,
  else: /\belse\b/g,
  elseIf: /\belse\s+if\s*\(/g,
  for: /\bfor\s*\(/g,
  enhancedFor: /\bfor\s*\([^:]+:\s*[^)]+\)/g,
  while: /\bwhile\s*\(/g,
  doWhile: /\bdo\s*\{/g,
  switch: /\bswitch\s*\(/g,
  case: /\bcase\s+/g,
  catch: /\bcatch\s*\(/g,
  ternary: /\?[^:]+:/g,
  logicalAnd: /&&/g,
  logicalOr: /\|\|/g
};

const DEPRECATED_PATTERNS = {
  threadStop: /Thread\.stop\s*\(/g,
  threadSuspend: /Thread\.suspend\s*\(/g,
  threadResume: /Thread\.resume\s*\(/g,
  dateGetYear: /Date\.getYear\s*\(/g,
  dateSetYear: /Date\.setYear\s*\(/g,
  stringBufferConstructor: /new\s+StringBuffer\s*\(/g,
  vectorUsage: /new\s+Vector\s*[<(]/g,
  hashtableUsage: /new\s+Hashtable\s*[<(]/g,
  observerObservable: /(Observer|Observable)/g
};

const MODERNIZATION_PATTERNS = {
  switchStatement: /switch\s*\([^)]+\)\s*\{[^}]*case\s+[^:]+:[^}]*break;/gs,
  stringBuffer: /StringBuffer/g,
  enhancedForLoop: /for\s*\(\s*int\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*[\w.]+\.length/g,
  classWithGettersSetters: /class\s+\w+\s*\{[^}]*(private\s+\w+\s+\w+;[\s\S]*?public\s+\w+\s+get\w+\s*\([^)]*\)[\s\S]*?public\s+void\s+set\w+\s*\([^)]*\))/g,
  threadCreation: /new\s+Thread\s*\(/g,
  nullCheck: /if\s*\(\s*\w+\s*!=\s*null\s*\)/g,
  typeDeclaration: /(List|Map|Set|ArrayList|HashMap|HashSet)<[\w<>,\s]+>\s+\w+\s*=\s*new\s+(ArrayList|HashMap|HashSet)<[\w<>,\s]*>/g
};

function removeComments(code) {
  let cleaned = code.replace(COMMENT_REGEX.multiLine, '');
  cleaned = cleaned.replace(COMMENT_REGEX.singleLine, '');
  return cleaned;
}

function extractMethodSignatures(code) {
  const methods = [];
  const regex = new RegExp(METHOD_SIGNATURE_REGEX);
  let match;

  while ((match = regex.exec(code)) !== null) {
    methods.push({
      fullSignature: match[0],
      methodName: match[2],
      index: match.index
    });
  }

  return methods;
}

function countPattern(code, pattern) {
  const matches = code.match(pattern);
  return matches ? matches.length : 0;
}

function findPatternMatches(code, pattern) {
  const matches = [];
  let match;
  const regex = new RegExp(pattern.source, pattern.flags);

  while ((match = regex.exec(code)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
      line: code.substring(0, match.index).split('\n').length
    });
  }

  return matches;
}

module.exports = {
  JAVA_KEYWORDS,
  COMPLEXITY_KEYWORDS,
  METHOD_SIGNATURE_REGEX,
  COMMENT_REGEX,
  CONTROL_FLOW_PATTERNS,
  DEPRECATED_PATTERNS,
  MODERNIZATION_PATTERNS,
  removeComments,
  extractMethodSignatures,
  countPattern,
  findPatternMatches
};
