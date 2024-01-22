// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract HusKyToken is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("Husky Token", "HKT")
        Ownable(initialOwner)
        ERC20Permit("HusKy Token")
        {
            _mint(msg.sender, 10000000 * 10 ** decimals());
        }

        function mint(address to,uint256 amount) public onlyOwner {
            _mint(to, amount);
        }

        function burn(uint256 amount) external {
            _burn(msg.sender, amount);
        }

}