// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Multicall3.sol";

/**
 * @title Executor
 * @dev Core entry point for the Onchain OS AI Agent to execute batch DeFi strategies on X Layer.
 * Inspired by DynaVest architecture.
 */
contract Executor is Multicall3 {
    address public agentWallet;

    event AgentExecutionCompleted(uint256 totalCalls);

    // حماية العقد بحيث لا ينفذ الأوامر سوى محفظة الوكيل الذكي (Agentic Wallet)
    modifier onlyAgent() {
        require(msg.sender == agentWallet, "Executor: Only Onchain OS Agentic Wallet can execute");
        _;
    }

    constructor() {
        // الحساب الذي سينشر العقد سيكون هو وكيل Onchain OS المعتمد
        agentWallet = msg.sender; 
    }

    /**
     * @dev Function used by the AI Agent to execute multiple strategy steps at once
     */
    function executeByAgent(Call3[] calldata calls) external payable onlyAgent returns (Result[] memory returnData) {
        returnData = aggregate3(calls);
        emit AgentExecutionCompleted(calls.length);
    }
}
