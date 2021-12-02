import { Button } from "@mui/material";
import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";

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
  return (
    <>
      {account ? (
        <Button variant="contained" onClick={deactivate}>
          {`${account.slice(0, 6)}...${account.slice(-6)}`}
        </Button>
      ) : (
        <Button variant="contained" onClick={activateBrowserWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}
