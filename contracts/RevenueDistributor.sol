// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RevenueDistributor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Project revenue distribution tracking
    struct Distribution {
        uint256 distributionId;
        uint256 totalAmount;
        uint256 platformShare;
        uint256 creatorShare;
        uint256 investorShare;
        uint256 distributionTimestamp;
        string metadata;
    }

    // Storage
    mapping(address => Distribution[]) private projectDistributions;
    mapping(address => uint256) public totalDistributionsForProject;
    address public platformWallet;
    uint256 public platformFeePercentage; // In basis points (100 = 1%)

    // Events
    event RevenueDistributed(
        address indexed projectAddress,
        uint256 distributionId,
        uint256 totalAmount,
        uint256 platformShare,
        uint256 creatorShare,
        uint256 investorShare
    );

    constructor(address _platformWallet, uint256 _platformFeePercentage) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_platformFeePercentage <= 1000, "Platform fee too high (max 10%)");
        
        platformWallet = _platformWallet;
        platformFeePercentage = _platformFeePercentage;
    }

    // Distribute revenue to a project
    function distributeRevenue(
        address projectAddress,
        uint256 amount
    ) external payable nonReentrant onlyOwner {
        require(msg.value >= amount, "Insufficient ETH sent");

        // Calculate shares
        uint256 platformShare = (amount * platformFeePercentage) / 10000;
        uint256 remainingAmount = amount - platformShare;
        
        // For this simplified version, we'll assume the remaining goes to investors
        // In a full implementation, you'd calculate shares based on token holdings
        uint256 investorShare = remainingAmount;
        uint256 creatorShare = 0; // Creator is typically paid through milestone releases

        // Transfer platform share
        if (platformShare > 0) {
            (bool platformSuccess, ) = platformWallet.call{value: platformShare}("");
            require(platformSuccess, "Platform share transfer failed");
        }

        // Record the distribution
        Distribution memory distribution = Distribution({
            distributionId: totalDistributionsForProject[projectAddress],
            totalAmount: amount,
            platformShare: platformShare,
            creatorShare: creatorShare,
            investorShare: investorShare,
            distributionTimestamp: block.timestamp,
            metadata: "Revenue distribution"
        });

        projectDistributions[projectAddress].push(distribution);
        totalDistributionsForProject[projectAddress]++;

        emit RevenueDistributed(
            projectAddress,
            distribution.distributionId,
            amount,
            platformShare,
            creatorShare,
            investorShare
        );
    }

    // Get number of distributions for a project
    function getDistributionCount(address projectAddress) external view returns (uint256) {
        return projectDistributions[projectAddress].length;
    }

    // Get specific distribution details
    function getDistribution(address projectAddress, uint256 distributionIndex) external view returns (
        uint256 distributionId,
        uint256 totalAmount,
        uint256 platformShare,
        uint256 creatorShare,
        uint256 investorShare,
        uint256 distributionTimestamp,
        string memory metadata
    ) {
        require(distributionIndex < projectDistributions[projectAddress].length, "Invalid distribution index");
        
        Distribution memory distribution = projectDistributions[projectAddress][distributionIndex];
        return (
            distribution.distributionId,
            distribution.totalAmount,
            distribution.platformShare,
            distribution.creatorShare,
            distribution.investorShare,
            distribution.distributionTimestamp,
            distribution.metadata
        );
    }

    // Update platform wallet address (only owner)
    function setPlatformWallet(address _platformWallet) external onlyOwner {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    // Update platform fee percentage (only owner)
    function setPlatformFeePercentage(uint256 _platformFeePercentage) external onlyOwner {
        require(_platformFeePercentage <= 1000, "Platform fee too high (max 10%)");
        platformFeePercentage = _platformFeePercentage;
    }

    // Fallback function to receive ETH
    receive() external payable {}
}