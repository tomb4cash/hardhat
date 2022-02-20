//--------------------    Hardhat version Web3js        ---------------------------------//
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
let secret = require("./secret.json");
let secret1 = require("./secret1.json");

extendEnvironment((hre) => {
  const Web3 = require("web3");
  hre.Web3 = Web3;

  // hre.network.provider is an EIP1193-compatible provider.
  hre.web3 = new Web3(hre.network.provider);
});

// task action function receives the Hardhat Runtime Environment as second argument
task("accounts", "Prints accounts", async (_, { web3 }) => {
  console.log(await web3.eth.getAccounts());
});

//---------------------     hardhat base etherJs               -------------------------------//
// require("@nomiclabs/hardhat-waffle");

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

//------------------------------------------------------------------------------------------------------------//

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    avalanch: {
      url: secret.url,
      accounts: [secret.key],
    },
    bscTestnet: {
      url: secret1.bscTestnet.url,
      accounts: [secret1.bscTestnet.key],
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
        //  details: { yul: false }
      },
    },
  },
  etherscan: {
    apiKey: secret1.bscTestnet.bscscan,
  },
  // allowUnlimitedContractSize: true,
};
