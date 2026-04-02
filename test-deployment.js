#!/usr/bin/env node

/**
 * Deployment Test Script
 * Run this to verify your deployment is working correctly
 */

const API_BASE = process.env.VITE_API_BASE_URL || 'https://test-case-creator-ov5m.vercel.app';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`\n🧪 Testing ${method} ${url}`);

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ SUCCESS: ${response.status} ${response.statusText}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ FAILED: ${response.status} ${response.statusText}`);
      console.log(`   Error:`, JSON.stringify(data, null, 2));
    }

    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting deployment tests...\n');

  // Test health endpoint
  await testEndpoint('/api/health');

  // Test analytics endpoint (might require auth)
  await testEndpoint('/api/ai/analytics');

  // Test test-cases endpoint (might require auth)
  await testEndpoint('/api/ai/test-cases');

  console.log('\n✨ Tests completed!');
  console.log('\n📝 Note: Some endpoints may require authentication.');
  console.log('   Check your Vercel environment variables if APIs are failing.');
}

runTests().catch(console.error);