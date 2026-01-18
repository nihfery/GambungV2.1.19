import { useEffect, useRef, useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ClipboardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect, usePublicClient } from "wagmi";

import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";

/* ================= HELPERS ================= */

function shortAddr(addr?: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function avatarText(name?: string, addr?: string) {
  if (name && name.length > 0) return name[0].toUpperCase();
  return addr ? addr.slice(2, 4).toUpperCase() : "?";
}

/* ================= COMPONENT ================= */

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actorName, setActorName] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const explorer = "https://etherscan.io/address/";

  /* ===== LOAD ACTOR NAME ===== */
  useEffect(() => {
    async function loadActor() {
      if (!publicClient || !address) {
        setActorName(null);
        return;
      }

      try {
        const actor = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "actors",
          args: [address],
        })) as readonly [string, string, boolean];

        const [name, , active] = actor;

        if (active && name && name.length > 0) {
          setActorName(name);
        } else {
          setActorName(null);
        }
      } catch {
        setActorName(null);
      }
    }

    loadActor();
  }, [publicClient, address]);

  /* ===== CLOSE ON OUTSIDE CLICK ===== */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function copyAddress() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* ===== LEFT ===== */}
        <button
          onClick={onMenuClick}
          className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-gray-100"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* ===== SEARCH ===== */}
        <div className="hidden md:block flex-1 max-w-lg relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            placeholder="Search menu..."
            className="w-full h-10 rounded-full border bg-gray-50 pl-12 pr-4 text-sm outline-none focus:bg-white"
          />
        </div>

        {/* ===== PROFILE / WALLET ===== */}
        {!isConnected && (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button
                onClick={show}
                className="h-9 px-4 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700"
              >
                Connect Wallet
              </button>
            )}
          </ConnectKitButton.Custom>
        )}

        {isConnected && (
          <div className="relative" ref={ref}>
            {/* PROFILE BUTTON */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 h-9 px-3 rounded-full border bg-white hover:bg-gray-50 transition"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-bold grid place-items-center">
                {avatarText(actorName ?? undefined, address)}
              </div>

              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium">
                  {actorName ?? shortAddr(address)}
                </span>
                {actorName && (
                  <span className="text-[11px] text-gray-400">
                    {shortAddr(address)}
                  </span>
                )}
              </div>

              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* ===== POPOVER ===== */}
            {open && (
              <div className="absolute right-0 mt-3 w-72 rounded-xl bg-white border shadow-lg p-4">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Account</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-2">
                  Connected with{" "}
                  <span className="font-medium text-gray-700">
                    {connector?.name || "Wallet"}
                  </span>
                </p>

                <div className="mb-3">
                  <p className="text-sm font-semibold">
                    {actorName ?? "Unregistered Actor"}
                  </p>
                  <p className="text-xs font-mono text-gray-500 break-all">
                    {address}
                  </p>
                </div>

                <button
                  onClick={copyAddress}
                  className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 mb-2"
                >
                  <ClipboardIcon className="inline h-4 w-4 mr-1" />
                  Copy Address
                </button>

                {copied && (
                  <p className="text-[11px] text-green-600 mb-2">
                    ✔ Address copied
                  </p>
                )}

                <button
                  onClick={() => {
                    disconnect();
                    setOpen(false);
                  }}
                  className="w-full rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50 mb-3"
                >
                  Disconnect Wallet
                </button>

                <a
                  href={`${explorer}${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-gray-600 hover:text-gray-800"
                >
                  ↗ View on Etherscan
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
