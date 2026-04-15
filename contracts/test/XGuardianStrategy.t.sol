// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/XGuardianStrategy.sol";

contract XGuardianStrategyTest is Test {
    XGuardianStrategy public guardian;

    function setUp() public {
        guardian = new XGuardianStrategy();
    }

    function testAgentOwnerIsDeployer() public {
        assertEq(guardian.agentOwner(), address(this));
    }
}
