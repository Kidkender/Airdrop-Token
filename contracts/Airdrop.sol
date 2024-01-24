// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Token.sol";

contract Airdrop is Ownable {
    using Math for uint;

    address public tokenAddress;

    event EtherTransfer(address beneficiary, uint amount);

    constructor(address _tokenAddr, address _owner) Ownable(_owner) {
        tokenAddress = _tokenAddr;
    }

    function airdropTokens(address[] memory _recipients, uint256[] memory _amount) public onlyOwner returns (bool) {
        IERC20 token = IERC20(tokenAddress);

        for (uint i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0));
            require(token.balanceOf(msg.sender) >= _amount[i], "Insufficient balance for airdrop");
            require(token.transfer(_recipients[i], _amount[i]), "Token transfer failed");
        }

        return true;
    }

    function airdropSameValue(address[] memory _recipients, uint256 _amount) public onlyOwner returns (bool) {
        IERC20 token = IERC20(tokenAddress);
        for (uint i = 0; i< _recipients.length; i++) 
        {
            require(_recipients[i] != address(0));
            require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance for airdrop");
            require(token.transfer(_recipients[i], _amount), "Token transfer failed");
        }
        return true;
    }

    function airdropEther(address[] memory _recipients, uint256[] memory _amount) public payable onlyOwner returns (bool) {
        uint total = 0 ;

        for (uint j = 0; j < _amount.length; j++) {
            total = total + _amount[j];
        }

        require(total <= msg.value);
        require(_recipients.length == _amount.length);

        for (uint i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0));
            payable(_recipients[i]).transfer(_amount[i]);

            emit EtherTransfer(_recipients[i], _amount[i]);
        }
        return true;
    }

    function updateTokenAddress(address newTokenAddress) public onlyOwner {
        tokenAddress = newTokenAddress;
    }

    function withdrawToken(address beneficiary) public onlyOwner {
        require(HusKyToken(tokenAddress).transfer(beneficiary, HusKyToken(tokenAddress).balanceOf(address(this))));
    }

    function withdrawEther(address payable beneficiary) public onlyOwner {
        beneficiary.transfer(address(this).balance);
    }

    function getContractBalance() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}

