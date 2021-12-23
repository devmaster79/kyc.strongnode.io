import { Button } from "@mui/material";
import { useTokenList,useToken,useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";

const UNISWAP_DEFAULT_TOKEN_LIST_URI = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
const SneAddress="0x32934CB16DA43fd661116468c1B225Fc26CF9A8c";

export function SneBalance() {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  const SneBalanceBigNumber = useTokenBalance(SneAddress, account);
  const SneBalance =
    SneBalanceBigNumber &&
    ethers.utils.formatUnits(SneBalanceBigNumber, 18);
  return SneBalance;
  // const balance = useEtherBalance(account);
  // const accountBalance = balance ? ethers.utils.formatEther(balance) : 0;
  // return accountBalance;
}

export default function ConnectButton() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const tokenInfo = useToken(account);
  const balance = useEtherBalance(account);
  const SneBalanceBigNumber = useTokenBalance(SneAddress, account);
  const SneBalance =
    SneBalanceBigNumber &&
    ethers.utils.formatUnits(SneBalanceBigNumber, 18);
  
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
            console.log(SneBalance)          
          }
        </Button>
      ) : (
        <Button variant="contained" onClick={activateBrowserWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}
