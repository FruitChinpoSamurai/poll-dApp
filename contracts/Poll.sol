// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "hardhat/console.sol";

contract Poll {
    struct Question {
        uint id;
        string prompt;
        uint yesVoteCount;
        uint noVoteCount;
    }

    uint public deployedAt;
    uint public expiresAt;

    // Read and write opeations; basically a key-value object like in JavaScript
    mapping(uint => Question) public questions;

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Cache for id count which will be incremented upon addition of new questions
    uint public questionsCount;

    // Add a new candidate with an auto-incremented id and default vote count of 0
    function addQuestion (string memory _prompt) private {
        console.log("Count before addition of new question: %s", questionsCount);
        questionsCount++;
        questions[questionsCount] = Question(questionsCount, _prompt, 0, 0);
        console.log("Count after addition of new question: %s", questionsCount);
    }

    // Vote on a question; voter should not have voted before and the question should be a valid choice
    function vote (bool[] calldata questionVotes) public {
        require(!voters[msg.sender]);
        require(!(block.timestamp >= expiresAt));
        for (uint i = 1; i <= questionsCount; i++) {
            if (questionVotes[i - 1] == true) {
                questions[i].yesVoteCount++;
            } else {
                questions[i].noVoteCount++;
            }
        }
        voters[msg.sender] = true;
    }

    // Constructor
    constructor () {
        addQuestion("Is Web3.0 the future?");
        addQuestion("Is learning about Web3.0 tech easy?");
        addQuestion("Are you ready to create your first dApp?");
        deployedAt = block.timestamp;
        expiresAt = deployedAt + 300;
    }
}