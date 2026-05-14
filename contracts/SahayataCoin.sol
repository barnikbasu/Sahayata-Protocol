// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AidTrust.sol";

/**
 * @title SahayataCoin
 * @dev Programmable aid token with spending restrictions.
 */
contract SahayataCoin is ERC20, Ownable {
    
    AidTrust public registry;

    struct SpendingState {
        uint256 spentToday;
        uint256 lastSpentTimestamp;
    }

    mapping(address => SpendingState) public spendingStates;

    event AidSpent(address indexed from, address indexed to, uint256 amount);

    constructor(address _registryAddress) ERC20("Sahayata Aid Token", "HELP") Ownable(msg.sender) {
        registry = AidTrust(_registryAddress);
    }

    function mint(address to, uint256 amount) external {
        // Only NGOs can trigger minting (aid distribution)
        require(registry.isNgo(msg.sender), "Only verified NGOs can distribute aid");
        _mint(to, amount);
    }

    /**
     * @dev Core logic for restricted spending.
     * Intercepts transfers to enforce category matching and daily limits.
     */
    function spend(address _merchant, uint256 _amount) external {
        (AidTrust.ParticipantType bType, AidTrust.Category bCategory, bool bVerified, uint256 bLimit) = registry.getParticipant(msg.sender);
        (AidTrust.ParticipantType mType, AidTrust.Category mCategory, bool mVerified, ) = registry.getParticipant(_merchant);

        require(bType == AidTrust.ParticipantType.Beneficiary && bVerified, "Sender must be a verified beneficiary");
        require(mType == AidTrust.ParticipantType.Merchant && mVerified, "Recipient must be a verified merchant");

        // Rule 1: Category Restriction
        if (bCategory != AidTrust.Category.General) {
            require(bCategory == mCategory, "Aid category mismatch for this merchant");
        }

        // Rule 2: Daily Spending Cap
        SpendingState storage state = spendingStates[msg.sender];
        if (block.timestamp - state.lastSpentTimestamp >= 1 days) {
            state.spentToday = 0;
        }
        
        require(state.spentToday + _amount <= bLimit, "Daily spending limit reached");

        // Execute settlement
        _transfer(msg.sender, _merchant, _amount);
        
        // Update state
        state.spentToday += _amount;
        state.lastSpentTimestamp = block.timestamp;

        emit AidSpent(msg.sender, _merchant, _amount);
    }

    /**
     * @dev Block P2P transfers to ensure aid is only spent at merchants.
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        // Skip checks for minting/burning
        if (from != address(0) && to != address(0)) {
            (AidTrust.ParticipantType toType, , bool toVerified, ) = registry.getParticipant(to);
            require((toType == AidTrust.ParticipantType.Merchant && toVerified) || registry.isNgo(from), "Aid must be spent at verified merchants");
        }
        super._update(from, to, value);
    }
}
