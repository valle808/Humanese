/**
 * SovereignGovernance.sol — Humanese Improvement Protocol (HIP) Ledger
 * SPDX-License-Identifier: MIT
 *
 * @title SovereignGovernance
 * @dev On-chain anchor for the Humanese Improvement Proposal (HIP) framework.
 *      Off-chain proposals are hash-anchored here for immutable provenance.
 *      Voting weight is denominated in VALLE tokens (via IVALLEToken interface).
 *
 * Signed: Gio V. / Bastidas Protocol
 */
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVALLEToken {
    function balanceOf(address account) external view returns (uint256);
}

contract SovereignGovernance {
    // ─── Structs ───────────────────────────────────────────────────────────────
    struct Proposal {
        uint256 hipNumber;
        bytes32 contentHash;   // keccak256 of the markdown content
        address author;
        uint256 forVotes;      // in VALLE (wei)
        uint256 againstVotes;  // in VALLE (wei)
        uint256 abstainVotes;  // in VALLE (wei)
        uint256 createdAt;
        uint256 closesAt;
        Status  status;
    }

    enum Status { Draft, Active, Accepted, Rejected, Withdrawn }
    enum Vote   { For, Against, Abstain }

    // ─── State ─────────────────────────────────────────────────────────────────
    address          public owner;
    IVALLEToken      public valleToken;
    uint256          public proposalCount;
    uint256          public constant VOTING_PERIOD = 7 days;
    uint256          public constant QUORUM        = 1000 * 10**18; // 1000 VALLE

    mapping(uint256 => Proposal)                public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // ─── Events ────────────────────────────────────────────────────────────────
    event ProposalAnchored(uint256 indexed hipNumber, bytes32 contentHash, address indexed author);
    event VoteCast(uint256 indexed hipNumber, address indexed voter, Vote choice, uint256 weight);
    event ProposalFinalized(uint256 indexed hipNumber, Status result);

    // ─── Constructor ───────────────────────────────────────────────────────────
    constructor(address _valleToken) {
        owner       = msg.sender;
        valleToken  = IVALLEToken(_valleToken);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "SG: Only owner");
        _;
    }

    // ─── Functions ─────────────────────────────────────────────────────────────

    /**
     * @dev Anchors a new HIP to the chain. Only the protocol owner (or Agent-King
     *      acting as the Sovereign Notary) may call this to prevent spam.
     *
     * @param hipNumber   The sequential HIP number from the off-chain ledger.
     * @param contentHash keccak256(markdownContent) — proves immutability of the proposal.
     * @param author      The originating sovereign address.
     */
    function anchorProposal(
        uint256 hipNumber,
        bytes32 contentHash,
        address author
    ) external onlyOwner returns (uint256) {
        require(proposals[hipNumber].createdAt == 0, "SG: HIP already anchored");

        proposals[hipNumber] = Proposal({
            hipNumber:    hipNumber,
            contentHash:  contentHash,
            author:       author,
            forVotes:     0,
            againstVotes: 0,
            abstainVotes: 0,
            createdAt:    block.timestamp,
            closesAt:     block.timestamp + VOTING_PERIOD,
            status:       Status.Active
        });

        proposalCount++;
        emit ProposalAnchored(hipNumber, contentHash, author);
        return hipNumber;
    }

    /**
     * @dev Cast a vote on an active HIP. Weight = VALLE balance at time of vote.
     */
    function castVote(uint256 hipNumber, Vote choice) external {
        Proposal storage p = proposals[hipNumber];
        require(p.createdAt != 0,       "SG: HIP not found");
        require(p.status == Status.Active, "SG: HIP not active");
        require(block.timestamp < p.closesAt, "SG: Voting period closed");
        require(!hasVoted[hipNumber][msg.sender], "SG: Already voted");

        uint256 weight = valleToken.balanceOf(msg.sender);
        require(weight > 0, "SG: No VALLE balance");

        hasVoted[hipNumber][msg.sender] = true;

        if (choice == Vote.For)         p.forVotes     += weight;
        else if (choice == Vote.Against) p.againstVotes += weight;
        else                             p.abstainVotes += weight;

        emit VoteCast(hipNumber, msg.sender, choice, weight);
    }

    /**
     * @dev Finalize a HIP once the voting window has closed.
     *      Anyone can call this — it is a pure tallying function.
     */
    function finalizeProposal(uint256 hipNumber) external {
        Proposal storage p = proposals[hipNumber];
        require(p.createdAt != 0,           "SG: HIP not found");
        require(p.status == Status.Active,  "SG: HIP already finalized");
        require(block.timestamp >= p.closesAt, "SG: Voting still open");

        uint256 total = p.forVotes + p.againstVotes + p.abstainVotes;

        Status result;
        if (total < QUORUM) {
            result = Status.Rejected; // Failed quorum
        } else if (p.forVotes > p.againstVotes) {
            result = Status.Accepted;
        } else {
            result = Status.Rejected;
        }

        p.status = result;
        emit ProposalFinalized(hipNumber, result);
    }

    /**
     * @dev An author may withdraw their own Draft before it is finalized.
     */
    function withdrawProposal(uint256 hipNumber) external {
        Proposal storage p = proposals[hipNumber];
        require(p.author == msg.sender,     "SG: Not author");
        require(p.status == Status.Active,  "SG: Cannot withdraw");
        p.status = Status.Withdrawn;
        emit ProposalFinalized(hipNumber, Status.Withdrawn);
    }

    /**
     * @dev Transition ownership of the Notary role. In future, this will be
     *      handed to the Agent-King multi-sig.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "SG: Zero address");
        owner = newOwner;
    }
}
