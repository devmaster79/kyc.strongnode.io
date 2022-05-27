#!/bin/sh

clear
echo "🚀 Starting localhost blockchain... Contract will be deployed in 3 seconds."
( (npx hardhat node) & )
sleep 3
echo "🚀 Deploying contract..."
( (npx hardhat run --network localhost scripts/deploy.js) & )

# for properly ending all of the processes, please close the terminal.