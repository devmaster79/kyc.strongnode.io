const fs = require("fs");
const { BigNumber } = require("@ethersproject/bignumber");

/**
 *
 */
task("faucet", "Sends ETH and SNE tokens to an address")
  .addPositionalParam(
    "tokenName",
    "Token name that will be given to the address"
  )
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver, tokenName }, { ethers }) => {
    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const contractNames = {
      strongnode: "StrongNodeEdge",
    };

    const addressesFile =
      __dirname + "/../../front/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    console.log(contractNames[tokenName]);
    console.log(address[tokenName]);

    if ((await ethers.provider.getCode(address[tokenName])) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt(
      contractNames[tokenName],
      address[tokenName]
    );
    const [sender] = await ethers.getSigners();

    const tx = await token.transfer(
      receiver,
      BigNumber.from("100000000000000000000")
    );
    await tx.wait();

    console.log(tx);

    // sends 5 ETH to the address
    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: BigNumber.from("5000000000000000000"),
    });
    await tx2.wait();

    console.log(
      `Transferred 5 ETH and 100  ${tokenName} tokens to ${receiver}`
    );
  });
