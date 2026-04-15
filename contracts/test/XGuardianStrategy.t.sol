// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Executor.sol";
import "../src/strategies/XGuardianStrategy.sol";

contract XGuardianIntegrationTest is Test {
    Executor public executor;
    XGuardianStrategy public strategy;
    address public agentWallet = address(0x123);

    event EmergencyProtectionExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amount,
        string reason
    );

    function setUp() public {
        // 1) الوكيل ينشر محرك Executor
        vm.startPrank(agentWallet);
        executor = new Executor();

        // 2) الوكيل ينشر الاستراتيجية ويربطها بالمحرك
        strategy = new XGuardianStrategy(address(executor));
        vm.stopPrank();
    }

    function testAgentMulticallExecutionWithRealData() public {
        // داتا سوق لمحاكاة قرار حماية
        address tokenIn = 0x1111111111111111111111111111111111111111;
        address tokenOut = 0x2222222222222222222222222222222222222222;
        uint256 amount = 10 ether;
        string memory reason = "AI OS Alert: Price dropped below safe threshold";

        // 1) Encoding مثل وكيل Onchain OS
        bytes memory callData = abi.encodeWithSelector(
            strategy.executeEmergencySwap.selector,
            tokenIn,
            tokenOut,
            amount,
            reason
        );

        // 2) تجهيز Call3 واحد داخل الباتش
        Multicall3.Call3[] memory calls = new Multicall3.Call3[](1);
        calls[0] = Multicall3.Call3({
            target: address(strategy),
            allowFailure: false,
            callData: callData
        });

        // 3) التنفيذ من الوكيل المعتمد + توقع انبعاث الحدث
        vm.prank(agentWallet);
        vm.expectEmit(true, true, false, true);
        emit EmergencyProtectionExecuted(tokenIn, tokenOut, amount, reason);

        // 4) إرسال أمر Multicall عبر Executor
        Multicall3.Result[] memory results = executor.executeByAgent(calls);

        // 5) Assertions
        assertEq(results.length, 1, "Unexpected results length");
        assertTrue(results[0].success, "Multicall execution failed");
    }

    function test_RevertWhen_UnauthorizedExecution() public {
        Multicall3.Call3[] memory calls = new Multicall3.Call3[](0);

        address hacker = address(0x999);
        vm.prank(hacker);
        vm.expectRevert("Executor: Only Onchain OS Agentic Wallet can execute");
        executor.executeByAgent(calls);
    }
}
