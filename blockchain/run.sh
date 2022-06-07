#!/bin/sh

clear

echo "🚀 Starting localhost blockchain... Contract will be deployed in 5 seconds."
npx hardhat node &
sleep 5

echo "🚀 Deploying contract..."
npx hardhat run --network localhost scripts/deploy.js &

wait
