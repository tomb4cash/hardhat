const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
const contract = require("../../artifacts/contracts/PoliceAndThief.sol/PoliceAndThief.json");
const fs = require("fs");

async function main() {
  const GameContract = new web3.eth.Contract(contract.abi);
  GameContract.options.data = contract.bytecode;

  const Game = GameContract.deploy({
    arguments: [
      "0xEf1b9030A8B1568E8253229B368572E9897aFf3A", // loot address
      "0x2af4c57D9d28B51eA5FAA3f2713F16E71aca1cDE", // trait address
      "600", // max quantity nft
      "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0", // dev address
    ],
  }).send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" }, function (error, transactionHash) {});
  console.log("Greeter deployed to:", (await Game).options.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
