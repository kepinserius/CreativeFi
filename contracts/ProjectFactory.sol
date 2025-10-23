// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CreatorProject.sol";

interface ICreatorProject {
    function title() external view returns (string memory);
    function description() external view returns (string memory);
    function category() external view returns (string memory);
    function fundingGoal() external view returns (uint256);
    function totalRaised() external view returns (uint256);
    function deadline() external view returns (uint256);
    function creator() external view returns (address);
    function isFunded() external view returns (bool);
    function isFailed() external view returns (bool);
    function isCompleted() external view returns (bool);
}

contract ProjectFactory is Ownable, ReentrancyGuard {
    // Project created event
    event ProjectCreated(
        address indexed projectAddress,
        string title,
        address indexed creator,
        uint256 fundingGoal,
        uint256 deadline
    );

    // Storage
    address[] public projects;
    mapping(address => uint256[]) public projectsByCreator;
    mapping(address => bool) public isProject;
    uint256 public platformFeePercentage; // Platform fee in basis points (100 = 1%)

    // Constructor
    constructor(uint256 _platformFeePercentage) Ownable(msg.sender) {
        platformFeePercentage = _platformFeePercentage;
    }

    // Create a new project
    function createProject(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _fundingGoal,
        uint256 _deadline,
        address _usdcToken,
        address _usdtToken,
        uint256 _creatorPercentage,
        uint256 _platformPercentage,
        uint256 _emergencyThreshold
    ) external nonReentrant returns (address) {
        require(_creatorPercentage + _platformPercentage <= 10000, "Percentages exceed 100%");
        require(_emergencyThreshold <= 5000, "Emergency threshold too high (max 50%)");
        
        // Create new project contract - need to import CreatorProject
        // We'll create using the bytecode directly or import properly
        CreatorProject newProject = new CreatorProject(
            _title,
            _description,
            _category,
            _fundingGoal,
            _deadline,
            msg.sender,
            _usdcToken,
            _usdtToken,
            _creatorPercentage,
            _platformPercentage,
            _emergencyThreshold
        );

        // Add project to storage
        uint256 projectId = projects.length;
        projects.push(address(newProject));
        isProject[address(newProject)] = true;
        projectsByCreator[msg.sender].push(projectId);

        // Emit event
        emit ProjectCreated(
            address(newProject),
            _title,
            msg.sender,
            _fundingGoal,
            _deadline
        );

        return address(newProject);
    }

    // Get project by index
    function getProject(uint256 projectId) external view returns (
        address projectAddress,
        string memory title,
        address creator,
        uint256 fundingGoal,
        uint256 totalRaised,
        uint256 deadline,
        bool isActive
    ) {
        require(projectId < projects.length, "Project does not exist");
        ICreatorProject project = ICreatorProject(projects[projectId]);
        
        return (
            projects[projectId],
            project.title(),
            project.creator(),
            project.fundingGoal(),
            project.totalRaised(),
            project.deadline(),
            !project.isFunded() && !project.isFailed() && !project.isCompleted()
        );
    }

    // Get total number of projects
    function getProjectsCount() external view returns (uint256) {
        return projects.length;
    }

    // Get projects by creator
    function getProjectsByCreatorAddress(address creatorAddress) external view returns (uint256[] memory) {
        return projectsByCreator[creatorAddress];
    }

    // Update platform fee percentage (only owner)
    function setPlatformFeePercentage(uint256 _platformFeePercentage) external onlyOwner {
        require(_platformFeePercentage <= 1000, "Platform fee too high (max 10%)");
        platformFeePercentage = _platformFeePercentage;
    }

    // Get platform fee percentage
    function getPlatformFeePercentage() external view returns (uint256) {
        return platformFeePercentage;
    }

    // Withdraw platform fees (only owner)
    function withdrawPlatformFees(address payable recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No platform fees to withdraw");
        recipient.transfer(balance);
    }
}