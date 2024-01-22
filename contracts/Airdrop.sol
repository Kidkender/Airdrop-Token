// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Token.sol";

contract Airdrop is Ownable {
    using Math for uint;

    address public tokenAddress;
    uint256 public _maxAirdropAmount;
    uint256 public _currentAirdropAmount;

    mapping(address => bool) public _processedAirdrop;

    event EtherTransfer(address beneficiary, uint amount);

  
    constructor(address _tokenAddr, address _owner) Ownable(_owner) {
        tokenAddress = _tokenAddr;
    }

    function dropTokens(address[] memory _recipients, uint256[] memory _amount) public onlyOwner returns (bool) {

        for (uint i =0; i< _recipients.length; i++) {
            require(_recipients[i] != address(0));
            require(HusKyToken(tokenAddress).transfer(_recipients[0], _amount[i]));
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

    function getMaxAirdropAmount() external view returns (uint256) {
        return _maxAirdropAmount;
    }

    function getCurrentAirdropAmount() external view returns (uint256) {
        return _currentAirdropAmount;
    }



}