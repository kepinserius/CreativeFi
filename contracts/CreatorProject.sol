// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CreatorProject is ERC20, ERC20Burnable, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Project Information
    string public title;
    string public description;
    string public category;
    uint256 public fundingGoal;
    uint256 public deadline;
    uint256 public totalRaised;
    uint256 public investorCount;
    address public creator;
    bool public isFunded;
    bool public isFailed;
    bool public isCompleted;

    // Token Economics
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    uint256 public creatorPercentage; // Percentage for creator (in basis points, 10000 = 100%)
    uint256 public platformPercentage; // Percentage for platform (in basis points)
    uint256 public investorPercentage; // Percentage for investors (in basis points)

    // Supported tokens
    IERC20 public usdcToken;
    IERC20 public usdtToken;
    mapping(address => bool) public supportedTokens;

    // Milestones
    struct Milestone {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        bool released;
        bool completed;
        string proofUrl;
    }
    Milestone[] public milestones;
    uint256 public milestoneCount;

    // Vesting for Creator
    uint256 public constant CLIFF_PERIOD = 90 days; // 3 months cliff
    uint256 public constant VESTING_PERIOD = 365 days; // 12 months vesting
    uint256 public vestingStartTime;
    uint256 public totalVestedAmount;
    uint256 public releasedVestedAmount;

    // Emergency withdrawal
    mapping(address => uint256) public emergencyVotes;
    mapping(address => bool) public hasVotedForEmergency;
    uint256 public emergencyThreshold; // Percentage of total tokens required for emergency withdrawal (in basis points)

    // Events
    event Investment(address indexed investor, uint256 amount, address token, uint256 tokensReceived);
    event MilestoneAdded(uint256 indexed milestoneId, string title, uint256 amount);
    event MilestoneCompleted(uint256 indexed milestoneId);
    event MilestoneFundsReleased(uint256 indexed milestoneId, uint256 amount);
    event RevenueDistributed(uint256 indexed projectId, uint256 amount, uint256 platformShare, uint256 creatorShare);
    event EmergencyWithdrawalInitiated(address indexed voter, uint256 votes);
    event EmergencyWithdrawalExecuted(uint256 amount);

    constructor(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _fundingGoal,
        uint256 _deadline,
        address _creator,
        address _usdcToken,
        address _usdtToken,
        uint256 _creatorPercentage,
        uint256 _platformPercentage,
        uint256 _emergencyThreshold
    ) ERC20(string.concat(_title, " Token"), string.concat("cr", _title)) {
        title = _title;
        description = _description;
        category = _category;
        fundingGoal = _fundingGoal;
        deadline = _deadline;
        creator = _creator;
        creatorPercentage = _creatorPercentage;
        platformPercentage = _platformPercentage;
        investorPercentage = 10000 - _creatorPercentage - _platformPercentage; // Remaining percentage goes to investors
        
        // Set supported tokens
        usdcToken = IERC20(_usdcToken);
        usdtToken = IERC20(_usdtToken);
        supportedTokens[_usdcToken] = true;
        supportedTokens[_usdtToken] = true;
        supportedTokens[address(0)] = true; // ETH support using address(0) as identifier
        
        emergencyThreshold = _emergencyThreshold;
        
        _mint(creator, TOTAL_SUPPLY);
        vestingStartTime = block.timestamp;
    }

    // Modifier to check if project is active
    modifier onlyActive() {
        require(!isFunded && !isFailed && !isCompleted, "Project is not active");
        _;
    }

    // Modifier to check if project has failed
    modifier onlyFailed() {
        require(isFailed, "Project has not failed");
        _;
    }

    // Investment function that accepts ETH, USDC, or USDT
    function invest(address token, uint256 amount) external payable nonReentrant onlyActive {
        require(block.timestamp < deadline, "Funding period has ended");
        
        if (token == address(0)) {
            // ETH investment
            require(msg.value == amount, "Amount mismatch for ETH");
        } else {
            require(supportedTokens[token], "Unsupported token");
            require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        }

        // Calculate tokens to mint based on amount invested
        uint256 tokensToMint = (amount * TOTAL_SUPPLY) / fundingGoal;
        
        // Mint tokens for investor
        _mint(msg.sender, tokensToMint);
        
        // Update project stats
        totalRaised += amount;
        if (token == address(0)) {
            // ETH investment - no additional action needed
        } else {
            // Track other token investments if needed
        }
        
        // Check if funding goal reached
        if (totalRaised >= fundingGoal) {
            isFunded = true;
        }
        
        // Update investor count if this is the first investment
        if (balanceOf(msg.sender) == tokensToMint) {
            investorCount++;
        }
        
        emit Investment(msg.sender, amount, token, tokensToMint);
    }

    // Add a milestone
    function addMilestone(
        string memory _title,
        string memory _description,
        uint256 _amount,
        uint256 _deadline,
        string memory _proofUrl
    ) external onlyOwner {
        require(!isCompleted, "Project is already completed");
        require(milestones.length == 0 || milestones[milestones.length - 1].released, "Previous milestone not released");
        
        milestones.push(Milestone({
            title: _title,
            description: _description,
            amount: _amount,
            deadline: _deadline,
            released: false,
            completed: false,
            proofUrl: _proofUrl
        }));
        
        milestoneCount++;
        emit MilestoneAdded(milestones.length - 1, _title, _amount);
    }

    // Complete a milestone
    function completeMilestone(uint256 milestoneId) external onlyOwner {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(!milestones[milestoneId].completed, "Milestone already completed");
        
        milestones[milestoneId].completed = true;
        emit MilestoneCompleted(milestoneId);
    }

    // Release funds for a completed milestone
    function releaseMilestoneFunds(uint256 milestoneId) external onlyOwner {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[milestoneId].completed, "Milestone not completed");
        require(!milestones[milestoneId].released, "Funds already released");
        require(block.timestamp >= milestones[milestoneId].deadline, "Milestone deadline not reached");
        
        uint256 amount = milestones[milestoneId].amount;
        require(address(this).balance >= amount, "Insufficient balance");
        
        // Calculate shares
        uint256 platformShare = (amount * platformPercentage) / 10000;
        uint256 creatorShare = (amount * creatorPercentage) / 10000;
        uint256 investorShare = amount - platformShare - creatorShare;
        
        // Transfer shares
        if (platformShare > 0) {
            // In a real implementation, send to platform wallet
            // For now, just track it
        }
        
        if (creatorShare > 0) {
            // Add to vesting pool instead of direct transfer
            totalVestedAmount += creatorShare;
        }
        
        if (investorShare > 0) {
            // This would go to a revenue distribution contract in a real implementation
            // For now, we'll consider it reserved for future revenue sharing
        }
        
        milestones[milestoneId].released = true;
        emit MilestoneFundsReleased(milestoneId, amount);
    }

    // Distribute revenue to token holders
    function distributeRevenue(uint256 amount) external nonReentrant {
        require(totalRaised > 0, "No investments made");
        require(address(this).balance >= amount, "Insufficient balance");
        
        // Calculate shares
        uint256 platformShare = (amount * platformPercentage) / 10000;
        uint256 remainingAmount = amount - platformShare;
        
        // Distribute to token holders proportionally
        // This is a simplified version - in practice, you'd use snapshots to track shares over time
        uint256 totalSupplyForDistribution = TOTAL_SUPPLY; // Exclude creator's initial tokens for this simple model
        
        if (platformShare > 0) {
            // Transfer platform share to platform wallet
            // Address needs to be configured in a real implementation
        }
        
        // Distribute investor share proportionally
        for (uint256 i = 0; i < 100; i++) { // In a real implementation, iterate through all token holders
            // For brevity, simplified distribution logic
        }
        
        emit RevenueDistributed(0, amount, platformShare, remainingAmount);
    }

    // Creator can withdraw vested tokens
    function withdrawVestedTokens() external {
        require(msg.sender == creator, "Only creator can withdraw vested tokens");
        
        uint256 currentTime = block.timestamp;
        require(currentTime >= vestingStartTime + CLIFF_PERIOD, "Cliff period not reached");
        
        uint256 elapsedTime = currentTime - vestingStartTime;
        uint256 maxVestedAmount;
        
        if (elapsedTime >= VESTING_PERIOD) {
            maxVestedAmount = totalVestedAmount;
        } else {
            maxVestedAmount = (totalVestedAmount * elapsedTime) / VESTING_PERIOD;
        }
        
        uint256 withdrawableAmount = maxVestedAmount - releasedVestedAmount;
        
        require(withdrawableAmount > 0, "No vested tokens available to withdraw");
        
        _transfer(creator, msg.sender, withdrawableAmount);
        releasedVestedAmount += withdrawableAmount;
    }

    // Vote for emergency withdrawal
    function voteForEmergencyWithdrawal() external nonReentrant onlyFailed {
        require(!hasVotedForEmergency[msg.sender], "Already voted for emergency withdrawal");
        
        uint256 voteWeight = balanceOf(msg.sender);
        emergencyVotes[msg.sender] = voteWeight;
        hasVotedForEmergency[msg.sender] = true;
        
        uint256 totalVotes = emergencyVotes[msg.sender];
        uint256 totalSupplyWithVotes = TOTAL_SUPPLY; // Simplified for this example
        
        if ((totalVotes * 10000) / totalSupplyWithVotes >= emergencyThreshold) {
            // Execute emergency withdrawal
            uint256 contractBalance = address(this).balance;
            (bool success, ) = msg.sender.call{value: contractBalance}("");
            require(success, "Emergency withdrawal failed");
            
            emit EmergencyWithdrawalExecuted(contractBalance);
        }
        
        emit EmergencyWithdrawalInitiated(msg.sender, voteWeight);
    }

    // Check if project failed (deadline passed without reaching funding goal)
    function checkProjectStatus() external {
        if (block.timestamp >= deadline && !isFunded) {
            isFailed = true;
        }
    }

    // Get milestone by ID
    function getMilestone(uint256 milestoneId) external view returns (
        string memory title,
        string memory description, 
        uint256 amount,
        uint256 deadline,
        bool released,
        bool completed,
        string memory proofUrl
    ) {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        
        Milestone memory m = milestones[milestoneId];
        return (m.title, m.description, m.amount, m.deadline, m.released, m.completed, m.proofUrl);
    }

    // Get available vested amount for creator
    function availableVestedAmount() external view returns (uint256) {
        if (msg.sender != creator) return 0;
        
        uint256 currentTime = block.timestamp;
        if (currentTime < vestingStartTime + CLIFF_PERIOD) return 0;
        
        uint256 elapsedTime = currentTime - vestingStartTime;
        uint256 maxVestedAmount;
        
        if (elapsedTime >= VESTING_PERIOD) {
            maxVestedAmount = totalVestedAmount;
        } else {
            maxVestedAmount = (totalVestedAmount * elapsedTime) / VESTING_PERIOD;
        }
        
        return maxVestedAmount - releasedVestedAmount;
    }

    // Standard receive function to accept ETH
    receive() external payable {
        // This contract can receive ETH payments
    }
}