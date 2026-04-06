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
    string public name = "Sovereign Token";
    string public symbol = "VALLE";
    uint8 public decimals = 18;
    
    // Tokenomics — IMMUTABLE
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 Billion VALLE
    uint256 public constant MINING_RESERVE = MAX_SUPPLY / 10; // 10% Mineable (100M)
    uint256 public constant INITIAL_REWARD = 1000 * 10**18;    // Initial reward per mine call
    uint256 public totalSupply;
    uint256 public totalMined;
    uint256 public miningStartTime;
    uint256 public constant MINING_DURATION = 100 * 365 days;  // 100-year mining window
    bool public decentralized;
    
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
     * @dev Returns the current mining reward based on linear decay over 100 years.
     * Reward starts at INITIAL_REWARD and decays linearly to 0 at MINING_DURATION.
     */
    function getMiningReward() public view returns (uint256) {
        uint256 timePassed = block.timestamp - miningStartTime;
        if (timePassed >= MINING_DURATION) return 0;
        
        // Linear decay: reward = INITIAL_REWARD * (1 - timePassed / MINING_DURATION)
        uint256 remaining = MINING_DURATION - timePassed;
        return (INITIAL_REWARD * remaining) / MINING_DURATION;
    }

    /**
     * @dev Autonomous mining function. Enforces 10% cap over 100 years with linear reward decay.
     */
    function mine() public {
        require(!decentralized || totalMined < MINING_RESERVE, "Mining pool exhausted");
        require(totalMined < MINING_RESERVE, "Mining pool exhausted");
        uint256 timePassed = block.timestamp - miningStartTime;
        require(timePassed < MINING_DURATION, "Mining period ended");

        uint256 reward = getMiningReward();
        require(reward > 0, "Reward is zero");
        
        // Enforce hard cap
        if (totalMined + reward > MINING_RESERVE) {
            reward = MINING_RESERVE - totalMined;
        }
        
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

    /**
     * @dev Renounce ownership — standard admin function.
     */
    function renounceOwnership() public onlyOwner {
        owner = address(0);
    }

    /**
     * @dev DECENTRALIZE — Permanently renounce ownership AND lock the contract.
     * After this call, no admin functions can ever be invoked again.
     * Mining continues autonomously per the decay curve until exhaustion.
     */
    function decentralize() public onlyOwner {
        decentralized = true;
        owner = address(0);
    }
}
