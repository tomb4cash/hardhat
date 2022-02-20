const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
const contract = require("../../artifacts/contracts/Traits3.sol/Traits3.json");
const fs = require("fs");

async function main() {
  const TraitContract = new web3.eth.Contract(contract.abi);
  TraitContract.options.data = contract.bytecode;

  const Trait = TraitContract.deploy({}).send(
    { from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" },
    function (error, transactionHash) {
      console.log("Tx Hash : " + transactionHash);
    }
  );

  console.log("Greeter deployed to:", (await Trait).options.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
