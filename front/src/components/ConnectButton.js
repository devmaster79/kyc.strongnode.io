import { Button } from "@mui/material";
import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";

const UNISWAP_DEFAULT_TOKEN_LIST_URI = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';

export function SneBalance() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  // const SneBalanceBigNumber = useTokenBalance(SneAddress, account);
  // const SneBalance =
  //   SneBalanceBigNumber &&
  //   ethers.utils.formatUnits(SneBalanceBigNumber, 9);
  // return SneBalance;
  const balance = useEtherBalance(account);
  const accountBalance = balance ? ethers.utils.formatEther(balance) : 0;
  return accountBalance;
}

export default function ConnectButton() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const tokenInfo = useToken(account);
  const balance = useEtherBalance(account);
  
  const { name, logoURI, tokens } = useTokenList(UNISWAP_DEFAULT_TOKEN_LIST_URI) || {}
  const accountBalance = balance ? ethers.utils.formatEther(balance) : 0;
  return (
    <>
      {account ? (
        <Button variant="contained" onClick={deactivate}>
          {`${account.slice(0, 6)}...${account.slice(-6)}`}
          {
            console.log(account),
            console.log(tokens),          
            console.log(accountBalance)          }
        </Button>
      ) : (
        <Button variant="contained" onClick={activateBrowserWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}
