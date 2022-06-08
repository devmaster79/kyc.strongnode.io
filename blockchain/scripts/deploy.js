/**
 * This function deploys StrongNodeEdge token to blockchain.
 * This function also compiles and creates ABI & address for into a /front folder,
 * so it can be used for debugging.
 * @returns {Promise<void>}
 */
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ETH
  const [deployer] = await ethers.getSigners();
  console.log(
    "Contract is being deployed with this contract:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // StrongNodeEdge Token
  const Strongnode = await ethers.getContractFactory("StrongNodeEdge");
  const strongnode = await Strongnode.deploy();
  await strongnode.deployed();

  console.log("Strongnode address:", strongnode.address);
  saveFrontendFiles(strongnode, "StrongNodeEdge", "strongnode");
}

/**
 * Function that generates
 * @param token
 */
function saveFrontendFiles(
  token,
  contractName = "StrongNodeEdge",
  tokenName = "Token"
) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../front/src/contracts/generated";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let contractAddresses = {};
  contractAddresses[tokenName] = token.address;

  // todo, we will be using more contracts, just edit this json if exists
  fs.writeFileSync(
    contractsDir + "/tokenAddressDictionary.json",
    JSON.stringify(contractAddresses, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractsDir + "/" + tokenName + ".json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

// run the function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
