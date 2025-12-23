// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReliefRegistry is Ownable {
    enum Category { NONE, FOOD, MEDICAL, SHELTER }
    
    mapping(address => bool) public isBeneficiary;
    mapping(address => Category) public merchantType;

    constructor() Ownable(msg.sender) {}

    function registerBeneficiary(address _victim) external onlyOwner {
        isBeneficiary[_victim] = true;
    }

    function registerMerchant(address _shop, uint8 _cat) external onlyOwner {
        merchantType[_shop] = Category(_cat);
    }
}
