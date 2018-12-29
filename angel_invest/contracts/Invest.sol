pragma solidity ^0.4.24;

import "./ConvertLib.sol";

contract Invest {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(uint256 num, address receiver, uint amount) public returns(bool sufficient) {
		if (num == 0){
			if (balances[msg.sender] < amount) return false;
			balances[msg.sender] -= amount;
			balances[receiver] += amount;
			emit Transfer(msg.sender, receiver, amount);
			return true;
		}
		else {
			if (balances[receiver] < amount) return false;
			balances[msg.sender] += amount;
			balances[receiver] -= amount;
			emit Transfer(msg.sender, receiver, amount);
			return true;
		}
	}

	string plans;
	function setPlan(string plan) public{
		plans = plan;
	}

	function getPlan() public returns (string myplan){
		return plans;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
