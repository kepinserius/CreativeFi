// scripts/deploy.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Starting deployment...");

  // For testing purposes, we'll use mock addresses for USDC and USDT on Mumbai
  // In a real deployment, you would use the actual token addresses
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const MOCK_USDC = "0x9999999999999999999999999999999999999999"; // Mock for testing
  const MOCK_USDT = "0x8888888888888888888888888888888888888888"; // Mock for testing

  // Deploy RevenueDistributor first
  console.log("Deploying RevenueDistributor...");
  const RevenueDistributor = await hre.ethers.getContractFactory("RevenueDistributor");
  
  // Using a mock platform wallet and 5% fee (500 basis points)
  const revenueDistributor = await RevenueDistributor.deploy(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Mock platform wallet
    500 // 5% platform fee
  );
  await revenueDistributor.waitForDeployment();
  console.log(`RevenueDistributor deployed to: ${revenueDistributor.target}`);

  // Deploy ProjectFactory
  console.log("Deploying ProjectFactory...");
  const ProjectFactory = await hre.ethers.getContractFactory("ProjectFactory");
  const projectFactory = await ProjectFactory.deploy(500); // 5% platform fee
  await projectFactory.waitForDeployment();
  console.log(`ProjectFactory deployed to: ${projectFactory.target}`);

  console.log("Deployment completed successfully!");
  console.log("\nContract addresses:");
  console.log(`ProjectFactory: ${projectFactory.target}`);
  console.log(`RevenueDistributor: ${revenueDistributor.target}`);
}

// Run the deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});