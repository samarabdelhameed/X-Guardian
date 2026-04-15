// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/strategies/XGuardianStrategy.sol";

contract DeployXGuardian is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // عنوان الـ Executor الخاص بكِ على شبكة X Layer
        address executorAddress = 0xd23eE223683071Bd1F357a312e9d6159148e7BBe;

        vm.startBroadcast(deployerPrivateKey);

        // نشر الاستراتيجية مع ربطها بالمحرك
        XGuardianStrategy guardian = new XGuardianStrategy(executorAddress);

        vm.stopBroadcast();
    }
}
