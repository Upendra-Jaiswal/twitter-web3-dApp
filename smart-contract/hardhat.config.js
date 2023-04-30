require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.2",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/MhsgNsD_i0Yh2I8v1y0kLvJtk-cHPKwu",
      accounts: [
        "6b3c066f46aa408fbe820fa1cad3bcfd1d7534c35bedda57b15a3f41ea8dc909",
      ],
    },
  },
};

//Profile Image Minter deployed to: 0xda799c5570a7E1862162cAc2226CD9B897acd339
