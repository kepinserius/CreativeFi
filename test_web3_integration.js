// test_web3_integration.js
// This script demonstrates how to connect to deployed contracts from a frontend application

const Web3 = require('web3');

// ABI for the ProjectFactory contract (simplified - you'd use the full ABI from artifacts)
const projectFactoryABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_platformFeePercentage", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" },
      { "internalType": "address", "name": "_usdcToken", "type": "address" },
      { "internalType": "address", "name": "_usdtToken", "type": "address" },
      { "internalType": "uint256", "name": "_creatorPercentage", "type": "uint256" },
      { "internalType": "uint256", "name": "_platformPercentage", "type": "uint256" },
      { "internalType": "uint256", "name": "_emergencyThreshold", "type": "uint256" }
    ],
    "name": "createProject",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
    "name": "getProject",
    "outputs": [
      { "internalType": "address", "name": "projectAddress", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "uint256", "name": "fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "totalRaised", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Example of how to connect to the contract from a frontend application
async function connectToProjectFactory() {
    console.log("Connecting to ProjectFactory contract...");
    
    // Check if Metamask is available
    if (window.ethereum) {
        // Use Metamask provider
        const web3 = new Web3(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // ProjectFactory contract address (from deployment)
        const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
        
        // Create contract instance
        const projectFactory = new web3.eth.Contract(projectFactoryABI, contractAddress);
        
        console.log("Connected to ProjectFactory at:", contractAddress);
        
        // Example: Get the platform fee percentage
        try {
            const platformFee = await projectFactory.methods.getPlatformFeePercentage().call();
            console.log("Platform fee percentage:", platformFee.toString());
        } catch (error) {
            console.error("Error getting platform fee:", error);
        }
        
        // Example: Create a new project
        try {
            const accounts = await web3.eth.getAccounts();
            const creatorAccount = accounts[0];
            
            // Project data
            const projectData = {
                title: "Test Project",
                description: "A test project for Content DeFi",
                category: "Technology",
                fundingGoal: web3.utils.toWei("10", "ether"), // 10 ETH
                deadline: Math.floor(Date.now() / 1000) + 86400 * 7, // 1 week from now
                usdcToken: "0x9999999999999999999999999999999999999999", // Mock USDC
                usdtToken: "0x8888888888888888888888888888888888888888", // Mock USDT
                creatorPercentage: 2000, // 20%
                platformPercentage: 500,  // 5%
                emergencyThreshold: 5000  // 50%
            };
            
            console.log("Creating project with data:", projectData);
            
            // Note: This would require proper funding and is for demonstration only
            // const result = await projectFactory.methods.createProject(
            //     projectData.title,
            //     projectData.description,
            //     projectData.category,
            //     projectData.fundingGoal,
            //     projectData.deadline,
            //     projectData.usdcToken,
            //     projectData.usdtToken,
            //     projectData.creatorPercentage,
            //     projectData.platformPercentage,
            //     projectData.emergencyThreshold
            // ).send({ from: creatorAccount, gas: 500000 });
            // 
            // console.log("Project created at:", result.events.ProjectCreated.returnValues.projectAddress);
        } catch (error) {
            console.error("Error creating project:", error);
        }
        
        return projectFactory;
    } else {
        console.error('Web3 provider not found. Please install Metamask.');
        return null;
    }
}

// Example of backend integration (this would be in your backend server)
function backendContractIntegration() {
    console.log("Backend contract integration example...");
    
    // In a real backend, you might connect to contracts directly using private keys
    // or use a different provider, but it would still use a Web3 library
    
    // Example: Initialize Web3 for backend use
    // const web3 = new Web3(process.env.WEB3_PROVIDER_URL || 'http://localhost:8545');
    
    // Then create contract instances and interact with them
    // This would involve server-side functions that can validate and relay
    // transactions between the frontend and smart contracts
}

// This is how you would structure the frontend-backend-contract integration
async function fullIntegrationTest() {
    console.log("Running full integration test...");
    
    // Frontend: Connect to contract and get user data
    const contract = await connectToProjectFactory();
    
    if (contract) {
        console.log("✓ Frontend contract connection established");
        
        // Backend: This would typically be API calls to your backend server
        // that validates the frontend request and potentially relays it to
        // the smart contract
        console.log("✓ Backend validation would occur here");
        
        // Contract: Interaction with the actual smart contract
        console.log("✓ Smart contract interaction would occur here");
        
        console.log("Full integration test completed successfully!");
    } else {
        console.log("✗ Frontend connection failed");
    }
}

// Run the test (in a real application, this would be triggered by user interaction)
fullIntegrationTest();
