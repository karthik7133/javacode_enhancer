const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:5000/api';

async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('Health check:', data);
    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testCodeAnalysis() {
  console.log('\n=== Testing Code Analysis ===');

  const sampleCode = `
public class Example {
    private Vector<String> data = new Vector<>();

    public void process(String input) {
        if (input != null) {
            if (input.length() > 0) {
                for (int i = 0; i < input.length(); i++) {
                    System.out.println(input.charAt(i));
                }
            }
        }
    }

    public void stopThread(Thread t) {
        t.stop();
    }
}
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: sampleCode }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('\nAnalysis Results:');
      console.log('- Complexity:', data.data.complexity);
      console.log('- Deprecated APIs:', data.data.deprecated.total);
      console.log('- Modernization Score:', data.data.modernization.modernizationScore);
      console.log('- Total Methods:', data.data.metrics.totalMethods);
      return true;
    } else {
      console.error('Analysis failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Analysis request failed:', error.message);
    return false;
  }
}

async function testCodeFormatting() {
  console.log('\n=== Testing Code Formatting ===');

  const unformattedCode = `
public class Test{
private int x;
public void method(){
if(x>0){
System.out.println("positive")
}
}
}
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: unformattedCode }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('Formatting successful!');
      console.log('Original lines:', data.data.originalLines);
      console.log('Formatted lines:', data.data.formattedLines);
      return true;
    } else {
      console.error('Formatting failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Formatting request failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('========================================');
  console.log('  Java Code Analyzer API Test Suite');
  console.log('========================================');

  const results = {
    health: await testHealthCheck(),
    analysis: await testCodeAnalysis(),
    formatting: await testCodeFormatting(),
  };

  console.log('\n========================================');
  console.log('  Test Results');
  console.log('========================================');
  console.log('Health Check:', results.health ? '✓ PASS' : '✗ FAIL');
  console.log('Code Analysis:', results.analysis ? '✓ PASS' : '✗ FAIL');
  console.log('Code Formatting:', results.formatting ? '✓ PASS' : '✗ FAIL');

  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall:', allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED');
  console.log('========================================\n');

  process.exit(allPassed ? 0 : 1);
}

runTests();
