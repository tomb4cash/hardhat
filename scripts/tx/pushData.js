const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");

// const addressClubUser = require(path.join(
//   basePath,
//   "/config/json/addressClubUser.json"
// ));

const Web3 = require("web3");
const express = require("express");
const app = express();
const CreaClubABI = require("../../src/artifacts/contracts/CreaClubBis.sol/CreaClub.json");
const dataClub = require("../../data/club/infoClub.json");
const BSCURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const ganacheURL = "HTTP://127.0.0.1:7545";

// const web3 = new Web3.providers.JsonRpcProvider(
//   "http://data-seed-pre-0-s1.binance.org:80"
// );
//https://data-seed-prebsc-1-s1.binance.org:8545/ ** testnet

var web3 = new Web3(
  new Web3.providers.HttpProvider(
    // "https://bsc-mainnet.gateway.pokt.network/v1/lb/61ba765fb183f8003931fe0a"
    // "https://speedy-nodes-nyc.moralis.io/2b9e6ff74846e88aa24b3e86/bsc/mainnet" // mainnet
    // "https://speedy-nodes-nyc.moralis.io/2b9e6ff74846e88aa24b3e86/bsc/testnet" // testnet
    "http://127.0.0.1:8545/"
  )
);
const contract = new web3.eth.Contract(
  CreaClubABI.abi,
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
);

// console.log(dataClub);

let addrOfUsers = [];
let ClubUsers = [];

let ClubUser = {
  nom: null,
  couleurs: null,
  pays: null,
  logo: null,
  nbVictoires: null,
  nbDefaites: null,
  niveau: null,
};

async function clubToOwner(_i) {
  await contract.methods
    .clubToOwner(_i)
    .call()
    .then((res) => {
      console.log(res);
      addrOfUsers.push(res);
    });
}
// clubToOwner(0);

async function getAccounts() {
  await web3.eth
    .getBalance(CreaClubAddress)
    // .call()
    .then((res) => console.log(res));
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

// getAccounts();
// console.log(addressClubUser.length);

async function clubs() {
  await contract.methods
    .clubs(0)
    .call()
    .then((res) => {
      let obj = {
        nom: res.nom,
        couleurs: res.couleurs,
        pays: res.pays,
        logo: res.logo,
        nbVictoires: res.nbVictoires,
        nbDefaites: res.nbDefaites,
        niveau: res.niveau,
      };
      ClubUsers.push(obj);
      console.log(res);
      fs.readFile(
        "/config/json/infoClub.json",
        { encoding: "utf-8" },
        function (err, data) {
          let objet = JSON.stringify(ClubUsers);
          fs.writeFile("./config/json/infoClub.json", objet, function (error) {
            if (error) {
              console.log(error);
            }
          });
        }
      );
    });
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

// clubs();

async function getTotal() {
  await contract.methods
    .totalClub()
    .call()
    .then((res) => console.log(res));
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

// getTotal();
// console.log(addressClubUser.length);

async function setArray() {
  await contract.methods
    ._bashArray([
      {
        nom: "ital",
        couleurs: "rouge",
        pays: "italy",
        logo: "",
      },
    ])
    .call()
    .then((res) => console.log(res));
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

// setArray();
// console.log(addressClubUser.length);

async function setBash() {
  await contract.methods
    ._bashSetUp(
      "0x19df15be79b14441b9211f24389bd049a368b2c0",
      "Maiki",
      "lightblue",
      "france",
      "art"
    )
    .call()
    .then((res) => console.log(res));
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

setBash();
// setArray();
// console.log(addressClubUser.length);

async function creerClub() {
  await contract.methods
    ._creerClub("Maiki", "lightblue", "france", "art")
    .call()
    .then((res) => console.log(res));
  // .call()
  // .then((res) => console.log(res));
  // console.log(accounts);
}

// creerClub();
// setArray();
// console.log(addressClubUser.length);

//----------batch_request ------- Push All Club using _bashArray Loop--------------//

let batch = new web3.BatchRequest();
// for (let i = 0; i < 96; i++) {
batch.add(
  contract.methods
    ._bashSetUp(
      // dataClub[i].address,
      // dataClub[i].nom,
      // dataClub[i].couleurs,
      // dataClub[i].pays,
      // dataClub[i].logo
      "0x19DF15bE79b14441B9211F24389Bd049a368B2C0",
      "Maiki",
      "lightblue",
      "france",
      "art"
    )
    .call.request(
      { from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" },
      "latest",
      (err, res) => {
        console.log(err);
        console.log(res);
        // addrOfUsers.push(res);
        // fs.readFile(
        //   "/config/json/addressClubUser.json",
        //   { encoding: "utf-8" },
        //   function (err, data) {
        //     let objet = JSON.stringify(addrOfUsers);
        //     fs.writeFile("addressClubUser.json", objet, function (error) {
        //       if (error) {
        //         console.log(error);
        //       }
        //     });
        //   }
        // );
      }
    )
);
// }

// batch.execute();

// console.log(addrOfUsers);

//----------batch_request ------- Push All Club--------------//

// let batch = new web3.BatchRequest();
// for (let i = 0; i < 96; i++) {
//   batch.add(
//     contract.methods
//       .clubToOwner(i)
//       .call.request(
//         { from: "0xd30A08F2fb19541F73e0697c34BaE10Df67a2593" },
//         "latest",
//         (err, res) => {
//           // console.log(err);
//           // console.log(res);
//           addrOfUsers.push(res);
//           fs.readFile(
//             "/config/json/addressClubUser.json",
//             { encoding: "utf-8" },
//             function (err, data) {
//               let objet = JSON.stringify(addrOfUsers);
//               fs.writeFile("addressClubUser.json", objet, function (error) {
//                 if (error) {
//                   console.log(error);
//                 }
//               });
//             }
//           );
//         }
//       )
//   );
// }

// batch.execute();

// console.log(addrOfUsers);

//---------------------------------------------------------------------------------//
//----------batch_request ------- Fetch Info par index + join() address--------------//

// let batch = new web3.BatchRequest();
// for (let i = 0; i < 96; i++) {
//   batch.add(
//     contract.methods
//       .clubs(i)
//       .call.request(
//         { from: "0xd30A08F2fb19541F73e0697c34BaE10Df67a2593" },
//         "latest",
//         (err, res) => {
//           let obj = {
//             nom: res.nom,
//             couleurs: res.couleurs,
//             pays: res.pays,
//             logo: res.logo,
//             nbVictoires: res.nbVictoires,
//             nbDefaites: res.nbDefaites,
//             niveau: res.niveau,
//             address: addressClubUser[i],
//           };
//           ClubUsers.push(obj);
//           console.log(res);
//           fs.readFile(
//             "/config/json/infoClub.json",
//             { encoding: "utf-8" },
//             function (err, data) {
//               let objet = JSON.stringify(ClubUsers);
//               fs.writeFile(
//                 "./config/json/infoClub.json",
//                 objet,
//                 function (error) {
//                   if (error) {
//                     console.log(error);
//                   }
//                 }
//               );
//             }
//           );
//         }
//       )
//   );
// }

// batch.execute();

// console.log(addrOfUsers);

//---------------------------------------------------------------------------------//

//-------Loop-----------------//
// let i = 0;

// let loop = setInterval(() => {
//   if (i <= 95) {
//     clubToOwner(i);
//     i++;
//   } else {
//     clearInterval(loop);
//     fs.readFile(
//       "/config/json/addressClubUser.json",
//       { encoding: "utf-8" },
//       function (err, data) {
//         addressClubUser = JSON.stringify(addrOfUsers);
//         fs.writeFile("addressClubUser.json", addressClubUser, function (error) {
//           if (error) {
//             console.log(error);
//           }
//         });
//       }
//     );
//   }
// }, 30000);

//---------END LOOP ---------//

// for (let i = 0; i < 10; i++) {
//   //   try {
//   async function clubToOwner(_i) {
//     await contract.methods
//       .clubToOwner(_i)
//       .call()
//       .then((res) => {
//         //   if (res !== undefined) {
//         console.log(res);
//         //   } else {
//         // terminus = false;
//         //   }
//       });
//   }

//   clubToOwner(i);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
// }

//*************************    SERVER        ************************************** */
// app.get("/send", function (req, res) {
//   let accounts;
//   try {
//     var web3 = new Web3(
//       new Web3.providers.HttpProvider(
//         "https://bsc-mainnet.gateway.pokt.network/v1/lb/61ba15d5ab9ce9003ad56b02"
//       )
//     );
//     async function getAccounts() {
//       accounts = await web3.eth.getAccounts();
//     }

//     getAccounts();
//     res.status(201).json("bonjour");
//   } catch (err) {
//     res.status(205).json({ err });
//   }
// });
// app.listen(3000, () => console.log("Example app listening on port 3000!"));
