# How to develop kyc.strongnode.io with local blockchain? 💻

## todo: table of contents

## 💿 Installation
### 1. Prerequisites
Here is the list of tools you'll need for development:
- running [kyc.strognode.io app](https://github.com/strongnodelabs/kyc.strongnode.io)
- [Metamask browser extension](https://metamask.io/download/)
### 2. Install dependencies and run
`❗️skip if you have run make install already  ⬇️`
```bash
cd blockchain
npm install

# now you have 3 options
# option 1 ⬇️
cd .. # main docker-compose is in the project's root
docker-compose up -d

# option 2 ⬇️
cd docker
docker-compose up -f blockchain.docker-compose.yaml -d

# option 3 ⬇️ (this option is not using Docker)
./blockchain/run.sh

```
#### 2.1. (ALTERNATIVE) Running manually
##### 2.1.1. Step 1: Start blockchain
```bash
npx hardhat node
```
This command starts ethereum blockchain with 20 generated wallets(hashes and private keys are in the console).
But since we want to have also an SNE token on our blockchain, we need to deploy it.
**Example output:**
```log
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
Accounts
========
WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```
##### 2.1.2. Step 2: Deploy a smart contract
If we want to deploy a contract, we need to have that contract in `/contracts` folder and we need to include it in the `/scripts` folder aswell.
But in this case you don't have to add anything, since the StrongNodeEdge contract is included in this repo (aswell as the deploy script). So you only need to run the following ⬇️
```bash
npx hardhat run --network localhost scripts/deploy.js
```
❗️remember that deploying is only possible when you have a running instance of blockchain❗️
After the script finishes, you can see that it created a folder in our frontend React app `repo/front/src/contracts`, which contains `contract-address.json` and `strongnode.json`.
`contract-address.json` includes list of all tokens & their addresses that are run on our blockchain.
### 3. 👺 Connect MetaMask to your blockchain
#### 3.1. Add JSON-RPC server to Metamask
By default, the JSON-RPC server runs at <http://127.0.0.1:8545/> (localhost:8454). Default chainID is 31337 and ETH is the symbol.
You can add the custom network to Metamask extension by clicking on `Metamask network selector`, then `Custom RPC`, enter the URL and chainID and `click save`.

[➡️if you want to see step by step images click here ⬅️](https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node)
#### 3.2. Add custom token into Metamask
In order to add a custom token into your Metamask extension, click `Import tokens` (under Don't see your token?). Token Contract Address is a address tha you'll going to pick up from the generated .json `repo/front/src/contracts/contract-address.json`.
## Usage examples
### 1. Add token to an address
Out of the box, Hardhat gives you 20 ETH wallets with preloaded 10,000 ETH, but zero any other tokens. So for use cases where you need to top up a different address with ETH and tokens you need to run this command ⬇️
```bash
npx hardhat --network localhost faucet strongnode 0xCf5E4e6a028D60FEBfc4409B934a5Db3bf2a16E1
```
```log
Usage: hardhat [GLOBAL OPTIONS] faucet tokenName receiver
POSITIONAL ARGUMENTS:
  tokenName     Token name that will be given to the address 
  receiver      The address that will receive them 
```
This script is going to give you 5 ETH and 100 tokens.
## 🔫 Trouble shooting
### 1. Error deploying contract. Nonce too high
This is a metamask error, it can be fixed by resetting the account in MetaMask extension.
Simply do it by following: **MetaMask -> account bubble –> Settings -> Advanced -> Reset account**.
![MetaMask guide](https://miro.medium.com/max/596/1*3mQe7MwIJFugo7E7h_F1kg.gif)
