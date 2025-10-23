// backend/test/api.test.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  wallet_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  username: 'testuser',
  email: 'test@example.com',
  role: 'creator'
};

// Variable to store auth token
let authToken: string | null = null;

async function testAPI() {
  console.log('🧪 Starting Content DeFi API Tests...\n');

  try {
    // Test 1: Health check
    console.log('✅ Testing Health Check Endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`   Status: ${healthResponse.status} - ${(healthResponse.data as any).message}\n`);

    // Test 2: Register User
    console.log('✅ Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log(`   Status: ${registerResponse.status} - ${(registerResponse.data as any).message}`);
    authToken = (registerResponse.data as any).token;
    console.log(`   User ID: ${(registerResponse.data as any).user.id}\n`);

    // Test 3: Get User Profile
    console.log('✅ Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/${testUser.wallet_address}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log(`   Status: ${profileResponse.status} - ${(profileResponse.data as any).username}\n`);

    // Test 4: Create Project (requires auth token)
    console.log('✅ Testing Create Project...');
    const projectData = {
      contract_address: '0x1234567890123456789012345678901234567890',
      title: 'Test Project',
      description: 'This is a test project created during API testing',
      category: 'Technology',
      funding_goal: 100,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      teaser_url: 'https://example.com/teaser.mp4',
      pitch_deck_url: 'https://example.com/pitch.pdf',
      status: 'active'
    };

    const projectResponse = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`   Status: ${projectResponse.status} - ${(projectResponse.data as any).message}`);
    const projectId = (projectResponse.data as any).project.id;
    console.log(`   Project ID: ${projectId}\n`);

    // Test 5: Get All Projects
    console.log('✅ Testing Get All Projects...');
    const allProjectsResponse = await axios.get(`${BASE_URL}/projects`);
    console.log(`   Status: ${allProjectsResponse.status} - Projects found: ${(allProjectsResponse.data as any).projects.length}\n`);

    // Test 6: Get Project by ID
    console.log('✅ Testing Get Project by ID...');
    const projectByIdResponse = await axios.get(`${BASE_URL}/projects/${projectId}`);
    console.log(`   Status: ${projectByIdResponse.status} - ${(projectByIdResponse.data as any).title}\n`);

    // Test 7: Get User Projects
    console.log('✅ Testing Get User Projects...');
    const userProjectsResponse = await axios.get(`${BASE_URL}/users/${testUser.wallet_address}/projects`);
    console.log(`   Status: ${userProjectsResponse.status} - Projects: ${(userProjectsResponse.data as any).count}\n`);

    console.log('🎉 All API tests completed successfully!');
    console.log('✅ Backend is fully functional and ready for frontend integration.');
  } catch (error: any) {
    if (error.response) {
      console.error(`❌ API Test Error: ${error.response.status} - ${error.response.data.message}`);
      console.error(`   Request URL: ${error.config?.url}`);
      console.error(`   Request Data: ${JSON.stringify(error.config?.data)}`);
    } else {
      console.error(`❌ General Error: ${error.message}`);
    }
  }
}

// Run tests
testAPI();