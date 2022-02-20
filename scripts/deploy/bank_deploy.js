const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
const contract = require("../../artifacts/contracts/Bank.sol/Bank.json");
const fs = require("fs");

async function main() {
  const BankContract = new web3.eth.Contract(contract.abi);
  BankContract.options.data = contract.bytecode;

  const Bank = BankContract.deploy({
    // data: contract.bytecode,
    arguments: [
      "0x6F2480C9599A9a7d14CD1c1D0dd82b6335572d9c", // game contract address
      "0xEf1b9030A8B1568E8253229B368572E9897aFf3A", // Loot contract address
    ],
    // arguments: ["Hello, Hardhat!"],
  }).send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" }, function (error, transactionHash) {
    console.log("Tx Hash : " + transactionHash);
  });

  console.log("Greeter deployed to:", (await Bank).options.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
