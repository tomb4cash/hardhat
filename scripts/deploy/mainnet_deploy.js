const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
// const contract = require("../../src/artifacts/contracts/SeedBis.sol/Seed.json");
const contract_seed = require("../../artifacts/contracts/Seed.sol/Seed.json");
const contract_loot = require("../../artifacts/contracts/THRONE.sol/THRONE.json");
const contract_trait = require("../../artifacts/contracts/Traits3.sol/Traits3.json");
const contract_game = require("../../artifacts/contracts/GameOfRisk.sol/GameOfRisk.json");
const contract_bank = require("../../artifacts/contracts/Battle.sol/Battle.json");
const knightTrait = require("../../data/knight/fullTuple.json");
const wwTrait = require("../../data/ww/fulltuple.json");
const fs = require("fs");
const myArgs = process.argv.slice(2)[0]; //**count */

const devAddr = "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0";
const user1Addr = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const leadAddr = "0x2bf977F1D8F6E3bC281CFF257c42A775bE42d7B0";

// console.log(fs);

async function main() {
  console.log(myArgs);
  //*****************        SEED DEPLOY          *************** */
  const SeedContract = new web3.eth.Contract(contract_seed.abi);
  SeedContract.options.data = contract_seed.bytecode;

  const Seed = SeedContract.deploy({}).send({ from: devAddr }, function (error, transactionHash) {});

  console.log("SEED deployed to:", (await Seed).options.address);

  //*****************        LOOT DEPLOY          *************** */

  const LootContract = new web3.eth.Contract(contract_loot.abi);
  LootContract.options.data = contract_loot.bytecode;

  const Loot = LootContract.deploy({}).send({ from: devAddr }, function (error, transactionHash) {});
  console.log("Loot deployed to:", (await Loot).options.address);

  //*****************        TRAIT DEPLOY          *************** */

  const TraitContract = new web3.eth.Contract(contract_trait.abi);
  TraitContract.options.data = contract_trait.bytecode;

  const Trait = TraitContract.deploy({}).send({ from: devAddr }, function (error, transactionHash) {});

  console.log("Trait deployed to:", (await Trait).options.address);

  //*****************        GAME DEPLOY          *************** */

  const GameContract = new web3.eth.Contract(contract_game.abi);
  GameContract.options.data = contract_game.bytecode;

  const Game = GameContract.deploy({
    arguments: [
      (await Loot).options.address, // loot address
      (await Trait).options.address, // trait address
      "50000", // max quantity nft
    ],
  }).send({ from: devAddr }, function (error, transactionHash) {});
  console.log("Game deployed to:", (await Game).options.address);

  //*****************        BANK DEPLOY          *************** */

  const BankContract = new web3.eth.Contract(contract_bank.abi);
  BankContract.options.data = contract_bank.bytecode;

  const Bank = BankContract.deploy({
    arguments: [
      (await Game).options.address, // game contract address
      (await Loot).options.address, // Loot contract address
    ],
  }).send({ from: devAddr }, function (error, transactionHash) {});
  console.log("Bank deployed to:", (await Bank).options.address);

  //**********************************  INIT TX SETUP     *********************************** */

  //***************   TRAIT INIT TX ***************** */

  const trait_contract = new web3.eth.Contract(contract_trait.abi, (await Trait).options.address);

  await trait_contract.methods
    .setGame((await Game).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  // const batch = new web3.BatchRequest();
  // for (let i = 0; i < knightTrait.length; i++) {
  //   let traitType = Number(i);
  //   let traitIds = [];
  //   let option = {
  //     to: (await Trait).options.address,
  //     dataContract: trait_contract.methods.uploadTraits(traitType, traitIds, knightTrait[i]),
  //     from: devAddr,
  //   };
  //   for (let e = 0; e < knightTrait[i].length; e++) {
  //     traitIds.push(e);
  //   }
  //   batch.add(await web3.eth.call.request(option, callBack()));
  // }
  // batch.execute();

  // function callBack(err, result) {
  //   console.log("error : " + err);
  //   console.log("result : " + result);
  // }
  // const batch2 = new web3.BatchRequest();
  // for (let i = 0; i < wwTrait.length; i++) {
  //   let traitType = Number(i) + 10;
  //   let traitIds = [];
  //   let option = {
  //     to: (await Trait).options.address,
  //     dataContract: trait_contract.methods.uploadTraits(traitType, traitIds, wwTrait[i]),
  //     from: devAddr,
  //   };
  //   for (let e = 0; e < wwTrait[i].length; e++) {
  //     traitIds.push(e);
  //   }
  //   batch2.add(await web3.eth.call.request(option, callBack()));
  // }
  // batch2.execute();

  // function callBack(err, result) {
  //   console.log("error : " + err);
  //   console.log("result : " + result);
  // }

  // await trait_contract.methods
  //   .setTraitCountForType(
  //     //********** */
  //     [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 15],
  //     [1, 11, 12, 9, 10, 1, 5, 4, 5, 4, 4]
  //     //********** */
  //   )
  //   .send({ from: devAddr })
  //   .then((res) => console.log(res));

  //***************   GAME INIT TX ***************** */

  const game_contract = new web3.eth.Contract(contract_game.abi, (await Game).options.address);

  await game_contract.methods
    .setBattle((await Bank).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await game_contract.methods
    .setRandomSource((await Seed).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***************   LOOT INIT TX ***************** */

  const loot_contract = new web3.eth.Contract(contract_loot.abi, (await Loot).options.address);

  await loot_contract.methods
    .addController(devAddr)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await loot_contract.methods
    .addController((await Bank).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await loot_contract.methods
    .addController((await Game).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //**********************************  TEST TX SETUP     *********************************** */

  //***************   SEED TEST TX ***************** */

  const Seed_contract = new web3.eth.Contract(contract_seed.abi, (await Seed).options.address);

  await Seed_contract.methods
    .setGame((await Game).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await Seed_contract.methods
    .setBattle((await Bank).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***************   GAME TEST TX ***************** */

  //***************   BANK TEST TX ***************** */

  const bank_contract = new web3.eth.Contract(contract_bank.abi, (await Bank).options.address);

  //***************   LOOT TEST TX ***************** */

  //**************  test Mint proc stolen     ********************** */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
