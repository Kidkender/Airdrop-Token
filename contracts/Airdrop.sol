// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Token.sol";

contract Airdrop is Ownable {
    using Math for uint;

    address public tokenAddress;
    uint256 public maxAirdropAmount;
    uint256 public currentAirdropAmount;

    mapping(address => bool) public _processedAirdrop;

    event EtherTransfer(address beneficiary, uint amount);

  
    constructor(address _tokenAddr, address _owner, uint256 _maxAirdropAmount) Ownable(_owner) {
        tokenAddress = _tokenAddr;
        maxAirdropAmount = _maxAirdropAmount;
    }

    function dropTokens(address[] memory _recipients, uint256[] memory _amount) public onlyOwner returns (bool) {

        for (uint i =0; i< _recipients.length; i++) {
            require(_recipients[i] != address(0));
            require(HusKyToken(tokenAddress).balanceOf(msg.sender) >= _amount[i], "Insufficient balance for airdrop");
            require(HusKyToken(tokenAddress).transfer(_recipients[0], _amount[i]), "Token transfer failed");
            currentAirdropAmount = currentAirdropAmount - _amount[i];
        }

        return true;
    }

    function dropEther(address[] memory _recipients, uint256[] memory _amount) public payable onlyOwner returns (bool) {
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

    function getCurrentAirdropAmount() external view returns (uint256) {
        return currentAirdropAmount;
    }

    function getBalanceOfSender() public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(msg.sender);
    }

}