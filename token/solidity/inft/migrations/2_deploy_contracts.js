
/*TEST: deploy the basic contract on holesky*/
const MyContract = artifacts.require("InftToken");
module.exports = function(deployer) {
  deployer.deploy(MyContract,20000000);
};

// const MyContract = artifacts.require("Inft");
// module.exports = function(deployer) {
//   deployer.deploy(MyContract,20000000);
// };

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   const balance = await deployer.getBalance();
//   console.log("Account balance:", balance.toString());

//   const Token = await ethers.getContractFactory("MyToken");
//   const token = await Token.deploy("MyToken", "MTK", 1000000); // Name, Symbol, Initial Supply (1 million)

//   console.log("Token deployed to:", token.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });