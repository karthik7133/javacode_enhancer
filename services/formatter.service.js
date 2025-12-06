const { normalizeLineEndings, sanitizeInput } = require('../utils/helper.utils');

function format(code) {
  if (!code || typeof code !== 'string') {
    return '';
  }

  let formatted = sanitizeInput(code);
  formatted = normalizeLineEndings(formatted);

  formatted = fixBraces(formatted);
  formatted = fixSpacing(formatted);
  formatted = addMissingSemicolons(formatted);
  formatted = fixIndentation(formatted);

  return formatted;
}

function fixBraces(code) {
  let result = code;

  result = result.replace(/\)\s*\{/g, ') {');

  result = result.replace(/\{\s*\n\s*\n/g, '{\n');

  result = result.replace(/\n\s*\n\s*\}/g, '\n}');

  result = result.replace(/}\s*else/g, '} else');

  result = result.replace(/}\s*catch/g, '} catch');

  result = result.replace(/}\s*finally/g, '} finally');

  return result;
}

function fixSpacing(code) {
  let result = code;

  result = result.replace(/\bif\(/g, 'if (');
  result = result.replace(/\bfor\(/g, 'for (');
  result = result.replace(/\bwhile\(/g, 'while (');
  result = result.replace(/\bswitch\(/g, 'switch (');
  result = result.replace(/\bcatch\(/g, 'catch (');

  result = result.replace(/,(\S)/g, ', $1');

  result = result.replace(/([+\-*/%=<>!&|^])\s*([+\-*/%=<>!&|^])/g, '$1$2');

  result = result.replace(/(\S)([+\-*/%]|==|!=|<=|>=|&&|\|\|)(\S)/g, '$1 $2 $3');

  result = result.replace(/\s+$/gm, '');

  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

function addMissingSemicolons(code) {
  let lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.length === 0 || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }

    const endsWithBrace = line.endsWith('{') || line.endsWith('}');
    const endsWithSemicolon = line.endsWith(';');
    const isControlFlow = /^(if|else|for|while|do|switch|case|default|try|catch|finally|class|interface|enum)\b/.test(line);
    const isAnnotation = line.startsWith('@');
    const isPackageOrImport = /^(package|import)\s/.test(line);

    if (!endsWithSemicolon && !endsWithBrace && !isControlFlow && !isAnnotation) {
      const trimmedOriginal = lines[i].trimEnd();
      if (trimmedOriginal.length > 0) {
        if (isPackageOrImport && !endsWithSemicolon) {
          lines[i] = trimmedOriginal + ';';
        } else if (/\breturn\b|\bthrow\b|=|\w+\(.*\)$/.test(line)) {
          lines[i] = trimmedOriginal + ';';
        }
      }
    }
  }

  return lines.join('\n');
}

function fixIndentation(code) {
  let lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 4;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.length === 0) {
      result.push('');
      continue;
    }

    const opensBlock = (line.match(/{/g) || []).length;
    const closesBlock = (line.match(/}/g) || []).length;

    if (closesBlock > 0 && !line.startsWith('{')) {
      indentLevel = Math.max(0, indentLevel - closesBlock);
    }

    const indent = ' '.repeat(indentLevel * indentSize);
    result.push(indent + line);

    if (opensBlock > 0) {
      indentLevel += opensBlock;
    }

    if (closesBlock > 0 && line.startsWith('{')) {
      indentLevel = Math.max(0, indentLevel - closesBlock);
    }
  }

  return result.join('\n');
}

function removeExtraWhitespace(code) {
  return code.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n/g, '\n\n');
}

module.exports = {
  format,
  fixBraces,
  fixSpacing,
  addMissingSemicolons,
  fixIndentation,
  removeExtraWhitespace
};
