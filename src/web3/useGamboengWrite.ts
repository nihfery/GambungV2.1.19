import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { gamboengAbi } from "../contracts/gamboengAbi";
import { GAMBOENG_ADDRESS } from "../contracts/address";

export function useCreatePluckingLot() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const tx = useWaitForTransactionReceipt({
    hash,
  });

  function createLot(
    lotId: string,
    qty: bigint,
    meta: string
  ) {
    writeContract({
      address: GAMBOENG_ADDRESS,
      abi: gamboengAbi,
      functionName: "createPluckingLot",
      args: [lotId, qty, meta],
    });
  }

  return {
    createLot,
    isPending,
    isSuccess: tx.isSuccess,
    error,
  };
}
