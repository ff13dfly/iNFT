
/*
TEST: 
deploy the basic contract on Sepolia Test Network
*/
const MyContract = artifacts.require("InftSepolia");
module.exports = function(deployer) {
  deployer.deploy(MyContract,10000000);
};