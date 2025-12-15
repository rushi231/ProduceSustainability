/**
 * Test Script for Produce Sustainability API
 * Run with: node test-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testData = {
  X: [
    [0, 0, 0],
    [1, 1, 1],
    [2, 4, 8],
    [3, 9, 27],
    [4, 16, 64]
  ],
  y: [10, 12, 15, 14, 18]
};

const salesData = {
  storeName: 'Fresh Mart',
  storeLocation: 'Downtown',
  itemName: 'Apples',
  quantitySold: 50,
  priceSold: 2.99
};

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health check endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data);
    console.log('');

    // Test 2: Train Model
    console.log('2️⃣  Testing ML model training...');
    const modelResponse = await axios.post(`${BASE_URL}/pred`, {
      data: testData
    });
    console.log('✅ Model trained successfully:');
    console.log('   Weights:', modelResponse.data.weights);
    console.log('   Bias:', modelResponse.data.bias);
    console.log('');

    // Test 3: Save Sales Data
    console.log('3️⃣  Testing save sales data...');
    const saveResponse = await axios.post(`${BASE_URL}/save-sales`, salesData);
    console.log('✅ Sales data saved:', saveResponse.data);
    console.log('');

    // Test 4: Get Sales History
    console.log('4️⃣  Testing get sales history...');
    const historyResponse = await axios.get(`${BASE_URL}/sales-history`, {
      params: {
        storeName: salesData.storeName,
        storeLocation: salesData.storeLocation,
        itemName: salesData.itemName
      }
    });
    console.log('✅ Sales history retrieved:');
    console.log(`   Found ${historyResponse.data.count} records`);
    console.log('');

    // Test 5: Get Weekly Stats
    console.log('5️⃣  Testing get weekly statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/weekly-stats`, {
      params: {
        storeName: salesData.storeName,
        storeLocation: salesData.storeLocation,
        daysBack: 7
      }
    });
    console.log('✅ Weekly statistics retrieved');
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

// Run tests
runTests();
