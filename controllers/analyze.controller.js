const formatterService = require('../services/formatter.service');
const complexityService = require('../services/complexity.service');
const deprecatedService = require('../services/deprecated.service');
const modernizationService = require('../services/modernization.service');
const extractMethodsService = require('../services/extractMethods.service');
const { isValidJavaCode } = require('../utils/helper.utils');

exports.analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Code is required and must be a string'
      });
    }

    if (!isValidJavaCode(code)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Java code',
        message: 'The provided code does not appear to be valid Java code'
      });
    }

    const formattedCode = formatterService.format(code);

    const complexityResult = complexityService.calculateComplexity(formattedCode);

    const deprecatedIssues = deprecatedService.getDeprecatedApis(formattedCode);
    const deprecatedSummary = deprecatedService.getDeprecatedSummary(deprecatedIssues);

    const modernizationOpportunities = modernizationService.getModernizationOpportunities(formattedCode);
    const modernizationSummary = modernizationService.getModernizationSummary(modernizationOpportunities);

    const methods = extractMethodsService.extractMethods(formattedCode);

    const complexityTrends = complexityService.analyzeComplexityTrends(complexityResult.methods);

    const codeMetrics = {
      totalLines: formattedCode.split('\n').length,
      totalMethods: methods.length,
      averageMethodLength: methods.length > 0
        ? Math.round(methods.reduce((sum, m) => sum + extractMethodsService.countMethodLines(m.code), 0) / methods.length)
        : 0
    };

    res.json({
      success: true,
      data: {
        formattedCode: formattedCode,
        complexity: {
          overall: complexityResult.overall,
          average: complexityResult.average,
          highest: complexityResult.highest,
          methods: complexityResult.methods,
          trends: complexityTrends,
          rating: complexityService.getComplexityRating(complexityResult.average)
        },
        deprecated: deprecatedSummary,
        modernization: modernizationSummary,
        metrics: codeMetrics,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while analyzing the code',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getHealth = (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'Java Code Analyzer API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};

exports.formatCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Code is required and must be a string'
      });
    }

    const formattedCode = formatterService.format(code);

    res.json({
      success: true,
      data: {
        formattedCode: formattedCode,
        originalLines: code.split('\n').length,
        formattedLines: formattedCode.split('\n').length
      }
    });

  } catch (error) {
    console.error('Error formatting code:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while formatting the code'
    });
  }
};
