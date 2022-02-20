const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
const contractTrait = require("../../artifacts/contracts/Traits3.sol/Traits3.json");
const addressList = require("../../data/dataAddress.json");
const knightTrait = require("../../data/knight/fullTuple.json");
const wwTrait = require("../../data/ww/fulltuple.json");
const fs = require("fs");
const myArgs = process.argv.slice(2)[0]; //**count */
const myArgs1 = process.argv.slice(2)[1]; //**count */

// console.log(fs);

const _cat = ["common", "uncommon", "rare", "epic", "legendary"];

async function main() {
  const Trait = new web3.eth.Contract(contractTrait.abi, addressList.trait);

  // const batch1 = new web3.BatchRequest();
  // for (let i = 0; i < knightTrait.length; i++) {
  //   let traitType = Number(i);
  //   console.log("traitType : " + traitType);
  //   let traitIds = [];
  //   for (let e = 0; e < knightTrait[i].length; e++) {
  //     traitIds.push(e);
  //     console.log(traitIds.length);
  //   }
  //   batch1.add(
  //     await Trait.methods
  //       .uploadTraits(traitType, traitIds, knightTrait[i])
  //       .send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" })
  //   );
  // }
  // batch1.execute();

  const batch2 = new web3.BatchRequest();
  for (let i = 0; i < wwTrait.length; i++) {
    let traitType = Number(i) + 10;
    console.log("traitType : " + traitType);
    let traitIds = [];
    for (let e = 0; e < wwTrait[i].length; e++) {
      traitIds.push(e);
      console.log(traitIds.length);
    }
    batch2.add(
      await Trait.methods
        .uploadTraits(traitType, traitIds, wwTrait[i])
        .send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" })
    );
  }
  batch2.execute();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//set up des knight = remplacement par knightTrait et  "let traitType = Number(i);"
//set up des ww = remplacement par wwTrait et  "let traitType = Number(i) + 10;"
