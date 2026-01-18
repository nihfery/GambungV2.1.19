import { createConfig, http } from "wagmi";
import { chains } from "./chains";

export const config = createConfig({
  chains,
  transports: {
    [chains[0].id]: http(),
  },
});
