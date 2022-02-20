const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
// const contract = require("../../src/artifacts/contracts/SeedBis.sol/Seed.json");
const contract = require("../../artifacts/contracts/Seed.sol/Seed.json");
const fs = require("fs");

// console.log(fs);

async function main() {
  const SeedContract = new web3.eth.Contract(contract.abi);
  SeedContract.options.data = contract.bytecode;

  const Seed = SeedContract.deploy({
    // data: contract.bytecode,
    // arguments: ["Hello, Hardhat!"],
  }).send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" }, function (error, transactionHash) {
    console.log("Tx Hash : " + transactionHash);
  });

  console.log("Greeter deployed to:", (await Seed).options.address);
  // const TmpAddr = (await Seed).options.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
