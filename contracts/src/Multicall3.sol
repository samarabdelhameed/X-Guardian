// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Multicall3
 * @dev Standard contract for batching multiple calls into a single transaction.
 */
contract Multicall3 {
    struct Call3 {
        address target;
        bool allowFailure;
        bytes callData;
    }

    struct Result {
        bool success;
        bytes returnData;
    }

    function aggregate3(Call3[] calldata calls) public payable returns (Result[] memory returnData) {
        uint256 length = calls.length;
        returnData = new Result[](length);
        Call3 calldata calli;
        for (uint256 i = 0; i < length;) {
            Result memory result = returnData[i];
            calli = calls[i];
            (result.success, result.returnData) = calli.target.call(calli.callData);
            require(calli.allowFailure || result.success, "Multicall3: call failed");
            unchecked { ++i; }
        }
    }
}
