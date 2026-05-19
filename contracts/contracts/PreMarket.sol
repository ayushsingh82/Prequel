// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @notice Binary YES/NO prediction market priced by a constant-product AMM.
///         1 collateral unit backs exactly one complete set (1 YES + 1 NO).
///         Buying YES mints a complete set into the pool then swaps the NO
///         side for more YES, leaving reserveYes * reserveNo == k intact.
///
///         The market is deployed empty and initialised in a second step so
///         the factory can fund it without juggling pre-approvals.
contract PreMarket {
    enum Outcome { Unresolved, Yes, No }

    IERC20 public immutable collateral;
    address public immutable resolver;
    address public immutable creator;
    uint256 public immutable expiry;
    string public question;

    uint256 public reserveYes;
    uint256 public reserveNo;

    mapping(address => uint256) public yesBalance;
    mapping(address => uint256) public noBalance;

    Outcome public outcome;
    bool public initialized;

    event Initialized(uint256 seed);
    event Bought(address indexed trader, bool yes, uint256 amountIn, uint256 amountOut);
    event Sold(address indexed trader, bool yes, uint256 amountIn, uint256 amountOut);
    event Resolved(Outcome outcome);
    event Redeemed(address indexed holder, uint256 amount);
    event SeedClaimed(address indexed creator, uint256 amount);

    modifier ready() {
        require(initialized, "uninit");
        require(outcome == Outcome.Unresolved, "resolved");
        require(block.timestamp < expiry, "expired");
        _;
    }

    constructor(
        address _collateral,
        address _resolver,
        address _creator,
        uint256 _expiry,
        string memory _question
    ) {
        require(_collateral != address(0), "collateral=0");
        require(_resolver != address(0), "resolver=0");
        require(_creator != address(0), "creator=0");
        require(_expiry > block.timestamp, "expiry past");

        collateral = IERC20(_collateral);
        resolver = _resolver;
        creator = _creator;
        expiry = _expiry;
        question = _question;
    }

    /// @notice Seal in the seed liquidity. The seed is whatever collateral
    ///         balance has been transferred to this contract before this call.
    ///         First-caller wins; the factory invokes this in the same
    ///         transaction as deployment so no race exists in practice.
    function initialize() external {
        require(!initialized, "init");
        uint256 seed = collateral.balanceOf(address(this));
        require(seed > 0, "seed=0");
        reserveYes = seed;
        reserveNo = seed;
        initialized = true;
        emit Initialized(seed);
    }

    /// @notice Spot price of YES, 1e18-scaled. priceYes + priceNo == 1e18.
    function priceYes() external view returns (uint256) {
        return (reserveNo * 1e18) / (reserveYes + reserveNo);
    }

    function priceNo() external view returns (uint256) {
        return (reserveYes * 1e18) / (reserveYes + reserveNo);
    }

    function buy(bool yes, uint256 amountIn, uint256 minOut)
        external
        ready
        returns (uint256 amountOut)
    {
        require(amountIn > 0, "amountIn=0");

        require(
            collateral.transferFrom(msg.sender, address(this), amountIn),
            "transferFrom"
        );

        uint256 rY = reserveYes;
        uint256 rN = reserveNo;
        uint256 k = rY * rN;

        if (yes) {
            uint256 newRN = rN + amountIn;
            uint256 newRY = k / newRN;
            amountOut = (rY + amountIn) - newRY;
            reserveYes = newRY;
            reserveNo = newRN;
            yesBalance[msg.sender] += amountOut;
        } else {
            uint256 newRY = rY + amountIn;
            uint256 newRN = k / newRY;
            amountOut = (rN + amountIn) - newRN;
            reserveYes = newRY;
            reserveNo = newRN;
            noBalance[msg.sender] += amountOut;
        }

        require(amountOut >= minOut, "slippage");
        emit Bought(msg.sender, yes, amountIn, amountOut);
    }

    function sell(bool yes, uint256 amountIn, uint256 minOut)
        external
        ready
        returns (uint256 amountOut)
    {
        require(amountIn > 0, "amountIn=0");

        if (yes) {
            require(yesBalance[msg.sender] >= amountIn, "balance");
            yesBalance[msg.sender] -= amountIn;
        } else {
            require(noBalance[msg.sender] >= amountIn, "balance");
            noBalance[msg.sender] -= amountIn;
        }

        uint256 rY = reserveYes;
        uint256 rN = reserveNo;

        // Solve dz^2 - (rY + rN + amountIn)*dz + amountIn*rOther = 0 for dz.
        uint256 b = rY + rN + amountIn;
        uint256 c = amountIn * (yes ? rN : rY);
        uint256 disc = b * b - 4 * c;
        amountOut = (b - _sqrt(disc)) / 2;

        if (yes) {
            reserveYes = rY + amountIn - amountOut;
            reserveNo = rN - amountOut;
        } else {
            reserveYes = rY - amountOut;
            reserveNo = rN + amountIn - amountOut;
        }

        require(amountOut >= minOut, "slippage");
        require(collateral.transfer(msg.sender, amountOut), "transfer");
        emit Sold(msg.sender, yes, amountIn, amountOut);
    }

    function resolve(Outcome _outcome) external {
        require(msg.sender == resolver, "not resolver");
        require(block.timestamp >= expiry, "early");
        require(outcome == Outcome.Unresolved, "resolved");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "bad outcome");
        outcome = _outcome;
        emit Resolved(_outcome);
    }

    function redeem() external returns (uint256 amount) {
        require(outcome != Outcome.Unresolved, "not resolved");
        if (outcome == Outcome.Yes) {
            amount = yesBalance[msg.sender];
        } else {
            amount = noBalance[msg.sender];
        }
        require(amount > 0, "nothing");
        yesBalance[msg.sender] = 0;
        noBalance[msg.sender] = 0;
        require(collateral.transfer(msg.sender, amount), "transfer");
        emit Redeemed(msg.sender, amount);
    }

    /// @notice After resolution the pool's winning-side reserve is unclaimed
    ///         liquidity that the seeder is entitled to recover.
    function claimSeed() external returns (uint256 amount) {
        require(msg.sender == creator, "not creator");
        require(outcome != Outcome.Unresolved, "not resolved");
        amount = outcome == Outcome.Yes ? reserveYes : reserveNo;
        require(amount > 0, "nothing");
        reserveYes = 0;
        reserveNo = 0;
        require(collateral.transfer(msg.sender, amount), "transfer");
        emit SeedClaimed(msg.sender, amount);
    }

    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
