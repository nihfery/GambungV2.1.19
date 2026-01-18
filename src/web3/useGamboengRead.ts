import { useReadContract } from "wagmi";
import { gamboengAbi } from "../contracts/gamboengAbi";
import { GAMBOENG_ADDRESS } from "../contracts/address";

type Address = `0x${string}`;

export function useCanLogin(
  address?: Address,
  options?: {
    enabled?: boolean;
  }
) {
  return useReadContract({
    address: GAMBOENG_ADDRESS,
    abi: gamboengAbi,
    functionName: "canLogin",
    args: address ? [address] : undefined,
    query: {
      enabled: options?.enabled ?? Boolean(address),
    },
  });
}
