// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartContract {
    address public client;
    address public freelancer;
    uint public amount;
    string public description;
    string public deliverables;
    string public deadline;
    string public milestones;
    string public penalties;
    bool public isFunded;
    bool public isWithdrawn;

    constructor(
        address _client,
        address _freelancer,
        uint _amount,
        string memory _description,
        string memory _deliverables,
        string memory _deadline,
        string memory _milestones,
        string memory _penalties
    ) {
        client = _client;
        freelancer = _freelancer;
        amount = _amount;
        description = _description;
        deliverables = _deliverables;
        deadline = _deadline;
        milestones = _milestones;
        penalties = _penalties;
        isFunded = false;
        isWithdrawn = false;
    }

    // Client deposits the agreed amount (escrow)
    function fund() external payable {
        require(msg.sender == client, "Only client can fund");
        require(!isFunded, "Already funded");
        require(msg.value == amount, "Incorrect amount");
        isFunded = true;
    }

    // Freelancer withdraws after work is done
    function withdraw() external {
        require(isFunded, "Not funded yet");
        require(!isWithdrawn, "Already withdrawn");
        require(msg.sender == freelancer, "Only freelancer can withdraw");
        isWithdrawn = true;
        payable(freelancer).transfer(amount);
    }
} 