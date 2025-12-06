const { removeComments, METHOD_SIGNATURE_REGEX } = require('../utils/regex.utils');
const { findMatchingBrace } = require('../utils/helper.utils');

function extractMethods(code) {
  const cleanedCode = removeComments(code);
  const methods = [];

  const methodRegex = /(public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(\{|throws)/g;
  let match;

  while ((match = methodRegex.exec(cleanedCode)) !== null) {
    const methodName = match[2];
    const startIndex = match.index;
    const signatureEndIndex = match.index + match[0].length;

    let bodyStartIndex = cleanedCode.indexOf('{', signatureEndIndex - 10);
    if (bodyStartIndex === -1) {
      bodyStartIndex = cleanedCode.indexOf('{', signatureEndIndex);
    }

    if (bodyStartIndex !== -1) {
      const bodyEndIndex = findMatchingBrace(cleanedCode, bodyStartIndex);

      if (bodyEndIndex !== -1) {
        const methodCode = cleanedCode.substring(startIndex, bodyEndIndex + 1);

        methods.push({
          name: methodName,
          code: methodCode,
          startIndex: startIndex,
          endIndex: bodyEndIndex + 1,
          signature: match[0]
        });
      }
    }
  }

  return methods;
}

function getMethodBody(methodCode) {
  const startIndex = methodCode.indexOf('{');
  const endIndex = methodCode.lastIndexOf('}');

  if (startIndex !== -1 && endIndex !== -1) {
    return methodCode.substring(startIndex + 1, endIndex);
  }

  return methodCode;
}

function countMethodLines(methodCode) {
  return methodCode.split('\n').filter(line => line.trim().length > 0).length;
}

module.exports = {
  extractMethods,
  getMethodBody,
  countMethodLines
};
