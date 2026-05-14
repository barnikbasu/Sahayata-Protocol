// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AidTrust
 * @dev Identity management for the Sahayata Protocol.
 * Handles whitelisting of NGOs, Beneficiaries, and Merchants.
 */
contract AidTrust is Ownable {
    
    enum ParticipantType { None, NGO, Beneficiary, Merchant }
    enum Category { General, Food, Medical, Water, Shelter }

    struct Participant {
        ParticipantType pType;
        Category category;
        bool verified;
        uint256 dailyLimit;
        address registeredBy;
    }

    mapping(address => Participant) public participants;
    mapping(address => bool) public isNgo;

    event EntityRegistered(address indexed account, ParticipantType pType, Category category);
    event EntityRevoked(address indexed account);

    constructor() Ownable(msg.sender) {
        // Owner is the primary NGO / Registrar by default
        isNgo[msg.sender] = true;
        participants[msg.sender] = Participant(ParticipantType.NGO, Category.General, true, 0, msg.sender);
    }

    modifier onlyNgo() {
        require(isNgo[msg.sender], "Caller is not a verified NGO");
        _;
    }

    function registerNGO(address _ngo) external onlyOwner {
        participants[_ngo] = Participant(ParticipantType.NGO, Category.General, true, 0, msg.sender);
        isNgo[_ngo] = true;
        emit EntityRegistered(_ngo, ParticipantType.NGO, Category.General);
    }

    function registerBeneficiary(address _beneficiary, Category _category, uint256 _dailyLimit) external onlyNgo {
        participants[_beneficiary] = Participant(ParticipantType.Beneficiary, _category, true, _dailyLimit, msg.sender);
        emit EntityRegistered(_beneficiary, ParticipantType.Beneficiary, _category);
    }

    function registerMerchant(address _merchant, Category _merchantCategory) external onlyNgo {
        participants[_merchant] = Participant(ParticipantType.Merchant, _merchantCategory, true, 0, msg.sender);
        emit EntityRegistered(_merchant, ParticipantType.Merchant, _merchantCategory);
    }

    function revokeParticipant(address _account) external onlyNgo {
        // Only owner can revoke an NGO, but any NGO can revoke a beneficiary they likely serve
        if (participants[_account].pType == ParticipantType.NGO) {
            require(msg.sender == owner(), "Only protocol owner can revoke NGOs");
            isNgo[_account] = false;
        }
        participants[_account].verified = false;
        emit EntityRevoked(_account);
    }

    function getParticipant(address _account) external view returns (ParticipantType, Category, bool, uint256) {
        Participant memory p = participants[_account];
        return (p.pType, p.category, p.verified, p.dailyLimit);
    }
}
