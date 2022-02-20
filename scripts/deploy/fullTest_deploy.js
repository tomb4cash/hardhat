const { artifacts, web3 } = require("hardhat");
const hre = require("hardhat");
// const contract = require("../../src/artifacts/contracts/SeedBis.sol/Seed.json");
const contract_seed = require("../../artifacts/contracts/Seed.sol/Seed.json");
const contract_loot = require("../../artifacts/contracts/LOOT.sol/LOOT.json");
const contract_trait = require("../../artifacts/contracts/Traits3.sol/Traits3.json");
const contract_game = require("../../artifacts/contracts/PoliceAndThief.sol/PoliceAndThief.json");
const contract_bank = require("../../artifacts/contracts/Bank.sol/Bank.json");
const knightTrait = require("../../data/knight/fullTuple.json");
const wwTrait = require("../../data/ww/fulltuple.json");
const fs = require("fs");
const myArgs = process.argv.slice(2)[0]; //**count */

const devAddr = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const user1Addr = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

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
      "5000", // max quantity nft
      devAddr, // leadAddress
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

  const batch = new web3.BatchRequest();
  for (let i = 0; i < knightTrait.length; i++) {
    let traitType = Number(i);
    let traitIds = [];
    let option = {
      to: (await Trait).options.address,
      dataContract: trait_contract.methods.uploadTraits(traitType, traitIds, knightTrait[i]),
      from: devAddr,
    };
    for (let e = 0; e < knightTrait[i].length; e++) {
      traitIds.push(e);
      console.log(traitIds.length);
    }
    batch.add(await web3.eth.call.request(option, callBack()));
  }
  batch.execute();

  function callBack(err, result) {
    console.log("error : " + err);
    console.log("result : " + result);
  }

  const batch2 = new web3.BatchRequest();
  for (let i = 0; i < wwTrait.length; i++) {
    let traitType = Number(i) + 10;
    let traitIds = [];
    let option = {
      to: (await Trait).options.address,
      dataContract: trait_contract.methods.uploadTraits(traitType, traitIds, wwTrait[i]),
      from: devAddr,
    };
    for (let e = 0; e < wwTrait[i].length; e++) {
      traitIds.push(e);
      console.log(traitIds.length);
    }
    batch2.add(await web3.eth.call.request(option, callBack()));
  }
  batch2.execute();

  function callBack(err, result) {
    console.log("error : " + err);
    console.log("result : " + result);
  }

  await trait_contract.methods
    .setTraitCountForType(
      //********** */
      [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 15],
      [15, 15, 12, 12, 15, 15, 8, 8, 8, 8, 4]
      //********** */
    )
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***************   GAME INIT TX ***************** */

  const game_contract = new web3.eth.Contract(contract_game.abi, (await Game).options.address);

  await game_contract.methods
    .setBank((await Bank).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await game_contract.methods
    .setRandomSource((await Seed).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await game_contract.methods
    .setPaused(false)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //**********************************  TEST TX SETUP     *********************************** */

  //***************   SEED TEST TX ***************** */

  const Seed_contract = new web3.eth.Contract(contract_seed.abi, (await Seed).options.address);

  await Seed_contract.methods
    .setMaster((await Game).options.address)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await Seed_contract.methods
    .update(144)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await Seed_contract.methods
    .seed()
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***************   GAME TEST TX ***************** */

  let priceNFT;
  let wallet;

  await game_contract.methods
    .MINT_PRICE()
    .call()
    .then((res) => (priceNFT = res));

  await game_contract.methods
    .setPaidTokens(100)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  console.log("price : " + priceNFT);

  await game_contract.methods
    .mint(85, false)
    .send({ from: devAddr, value: Number(priceNFT) * 85 })
    .then((res) => console.log(res));

  await game_contract.methods
    .whiteListMint(15)
    .send({ from: devAddr, value: Number(priceNFT) * 15 })
    .then((res) => console.log(res));

  // await game_contract.methods
  //   .mint(20, false)
  //   .send({ from: devAddr, value: Number(priceNFT) * 20 })
  //   .then((res) => console.log(res));

  await game_contract.methods
    .walletOfOwner(devAddr)
    .call()
    .then((res) => {
      console.log(res);
      wallet = res;
    });

  await game_contract.methods
    .setApprovalForAll((await Bank).options.address, true)
    .call()
    .then((res) => console.log(res));

  // await game_contract.methods
  // .MINT_PRICE()
  // .call()
  // .then((res) => console.log(res));

  //***************   BANK TEST TX ***************** */

  const bank_contract = new web3.eth.Contract(contract_bank.abi, (await Bank).options.address);

  await bank_contract.methods
    .setPaused(false)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await bank_contract.methods
    .addManyToBankAndPack(devAddr, wallet)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***************   LOOT TEST TX ***************** */

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

  await loot_contract.methods
    .mint(user1Addr, "5000000000000000000000000000000000000000000000000000000")
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //**************  test Mint proc stolen     ********************** */

  //***********GIVE AWAY ********** */
  await game_contract.methods
    .Giveaway(user1Addr, 50)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  //***********WHITELIST MINT NEXT GEN-1 ********** */
  await game_contract.methods
    .addToWLGen1([devAddr])
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await game_contract.methods
    .owner()
    .call()
    .then((res) => console.log(res));
  console.log(devAddr);

  await game_contract.methods
    .whiteListMint(25)
    .send({ from: devAddr })
    .then((res) => console.log(res));

  await game_contract.methods
    .mint(50, false)
    .send({ from: user1Addr })
    .then((res) => console.log(res));
  await game_contract.methods
    .mint(50, false)
    .send({ from: user1Addr })
    .then((res) => console.log(res));

  //**********  synthèse stats game mint ********** */

  await game_contract.methods
    .minted()
    .call()
    .then((res) => console.log("Minted : " + res));
  await game_contract.methods
    .knightCount()
    .call()
    .then((res) => console.log("knightCount : " + res));
  await game_contract.methods
    .knightStolen()
    .call()
    .then((res) => console.log("knightStolen : " + res));
  await game_contract.methods
    .wwCount()
    .call()
    .then((res) => console.log("wwCount : " + res));
  await game_contract.methods
    .wwStolen()
    .call()
    .then((res) => console.log("wwStolen : " + res));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
