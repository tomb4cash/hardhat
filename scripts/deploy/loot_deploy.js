const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
const contract = require("../../artifacts/contracts/LOOT.sol/LOOT.json");
// const playerlist = require("../../data/player/cleanListPlayer.json");
const fs = require("fs");

// console.log(fs);

// const _cat = ["common", "uncommon", "rare", "epic", "legendary"];

async function main() {
  const LootContract = new web3.eth.Contract(contract.abi);
  LootContract.options.data = contract.bytecode;

  const Loot = LootContract.deploy({}).send(
    { from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" },
    function (error, transactionHash) {
      console.log("Tx Hash : " + transactionHash);
    }
  );

  console.log("Greeter deployed to:", (await Loot).options.address);
  // readAndWrite("./data/dataAddress.json");

  // function readAndWrite(_path) {
  //   fs.readFileSync(_path, { encoding: "utf-8" }, async function (error, data) {
  //     let _data = await JSON.parse(data);

  //     _data.loot = "0x00000000000000000";
  //     console.log(data);

  //     // let objet = JSON.stringify(_data);
  //     let objet = _data;

  //     fs.writeFileSync(`${_path}`, objet, function (error) {
  //       if (error) {
  //         console.log(error);
  //       }
  //     });
  //   });
  // }

  // const Player = new web3.eth.Contract(
  //   contract.abi,
  //   (await player).options.address
  // );

  // await Player.methods
  //   .firstSetting()
  //   .send({ from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0" })
  //   .then((res) => console.log(res));

  // const batch = new web3.BatchRequest();
  // for (let i = 0; i < playerlist.length; i++) {
  //   batch.add(
  //     await Player.methods
  //       .addNewNFT(
  //         playerlist[i].player,
  //         playerlist[i].lien,
  //         playerlist[i].nb,
  //         playerlist[i].attributes
  //       )
  //       .send({
  //         from: "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0",
  //       })
  //   );
  // }

  // batch.execute();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
