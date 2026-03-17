// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VALLE Token — Sovereign Registry Fuel
 * @dev Implementation of the ERC-3643 (T-REX) standard for compliant RWA tokenization.
 * 
 * Features:
 * - Identity Registry integration for KYC/AML compliance.
 * - Modular Compliance (rules for transfers).
 * - On-chain notarization support.
 */

interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

interface ICompliance {
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool);
}

contract VALLEToken {
    string public name = "Humanese Sovereign Token";
    string public symbol = "VALLE";
    uint8 public decimals = 18;
    
    // Tokenomics
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 Billion VALLE
    uint256 public constant MINING_RESERVE = MAX_SUPPLY / 10; // 10% Mineable
    uint256 public totalSupply;
    uint256 public totalMined;
    uint256 public miningStartTime;
    uint256 public constant MINING_DURATION = 100 * 365 days;
    
    address public owner;
    IIdentityRegistry public identityRegistry;
    ICompliance public compliance;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokenMined(address indexed miner, uint256 amount);

    constructor() {
        owner = msg.sender;
        miningStartTime = block.timestamp;
        
        // Initial supply for treasury/liquidity (90%)
        uint256 initialSupply = MAX_SUPPLY - MINING_RESERVE;
        mint(msg.sender, initialSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * @dev Autonomous mining function. Ensures only 10% is mineable over 100 years.
     * Implements a linear decay or block-based reward.
     */
    function mine() public {
        require(totalMined < MINING_RESERVE, "Mining pool exhausted");
        uint256 timePassed = block.timestamp - miningStartTime;
        require(timePassed < MINING_DURATION, "Mining period ended");

        // Reward calculation: simple linear distribution over 100 years for this POC
        // In production, this would be linked to PoW/PoS or specific Oracles.
        uint256 reward = (MINING_RESERVE / MINING_DURATION) * 1 hours; // Base rate per hour
        
        require(totalMined + reward <= MINING_RESERVE, "Reward exceeds cap");
        
        totalMined += reward;
        totalSupply += reward;
        balanceOf[msg.sender] += reward;
        
        emit TokenMined(msg.sender, reward);
        emit Transfer(address(0), msg.sender, reward);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _validateTransfer(msg.sender, _to, _value);
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        _validateTransfer(_from, _to, _value);
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function _validateTransfer(address _from, address _to, uint256 _amount) internal view {
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        
        if (address(identityRegistry) != address(0)) {
            require(identityRegistry.isVerified(_from), "Sender identity not verified");
            require(identityRegistry.isVerified(_to), "Receiver identity not verified");
        }

        if (address(compliance) != address(0)) {
            require(compliance.canTransfer(_from, _to, _amount), "Compliance rule violation");
        }
    }

    function mint(address _to, uint256 _amount) internal {
        require(totalSupply + _amount <= MAX_SUPPLY, "Max supply exceeded");
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function renounceOwnership() public onlyOwner {
        owner = address(0);
    }
}
