// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {SentinelReportRegistry} from "../src/SentinelReportRegistry.sol";

contract DeploySentinelReportRegistry is Script {
    function run() external returns (SentinelReportRegistry registry) {
        vm.startBroadcast();
        registry = new SentinelReportRegistry();
        vm.stopBroadcast();
    }
}
