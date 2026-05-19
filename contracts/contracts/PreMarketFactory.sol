// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PreMarket} from "./PreMarket.sol";

interface IERC20Like {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

/// @notice Deploys and indexes PreMarket instances. Caller pre-approves the
///         factory for `seed`; the factory pulls collateral, deploys the
///         market, forwards the seed to it, and initialises it — all in one
///         transaction.
contract PreMarketFactory {
    address public immutable collateral;
    address public immutable resolver;

    address[] private _markets;

    event MarketCreated(
        address indexed market,
        address indexed creator,
        string question,
        uint256 expiry,
        uint256 seed
    );

    constructor(address _collateral, address _resolver) {
        require(_collateral != address(0), "collateral=0");
        require(_resolver != address(0), "resolver=0");
        collateral = _collateral;
        resolver = _resolver;
    }

    function createMarket(string calldata question, uint256 expiry, uint256 seed)
        external
        returns (address market)
    {
        require(seed > 0, "seed=0");

        require(
            IERC20Like(collateral).transferFrom(msg.sender, address(this), seed),
            "pull seed"
        );

        PreMarket m = new PreMarket(collateral, resolver, msg.sender, expiry, question);

        require(
            IERC20Like(collateral).transfer(address(m), seed),
            "push seed"
        );

        m.initialize();

        market = address(m);
        _markets.push(market);

        emit MarketCreated(market, msg.sender, question, expiry, seed);
    }

    function marketsLength() external view returns (uint256) {
        return _markets.length;
    }

    function markets(uint256 i) external view returns (address) {
        return _markets[i];
    }

    function allMarkets() external view returns (address[] memory) {
        return _markets;
    }
}
