import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";

type Address = `0x${string}`;

export default function Ownership() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [owner, setOwner] = useState<Address | null>(null);
  const [newOwner, setNewOwner] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD OWNER ================= */
  useEffect(() => {
    async function loadOwner() {
      if (!publicClient) return;

      const currentOwner = (await publicClient.readContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "owner",
      })) as Address;

      setOwner(currentOwner);
    }

    loadOwner();
  }, [publicClient]);

  const isOwner =
    owner && address && owner.toLowerCase() === address.toLowerCase();

  /* ================= TRANSFER ================= */
  async function transferOwnership() {
    if (!walletClient || !newOwner) return;

    if (!newOwner.startsWith("0x") || newOwner.length !== 42) {
      alert("Alamat owner baru tidak valid");
      return;
    }

    const confirm = window.confirm(
      `⚠️ PERINGATAN\n\nOwnership akan dipindahkan ke:\n${newOwner}\n\nKamu TIDAK bisa membatalkan aksi ini.\n\nLanjutkan?`
    );

    if (!confirm) return;

    try {
      setLoading(true);

      const hash = await walletClient.writeContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "transferOwnership",
        args: [newOwner as Address],
      });

      await publicClient?.waitForTransactionReceipt({ hash });

      alert("Ownership berhasil dipindahkan");
      setNewOwner("");
    } catch (err) {
      console.error("Transfer ownership error:", err);
      alert("Gagal transfer ownership");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">System Ownership</h1>
        <p className="text-gray-400">
          Smart contract ownership management
        </p>
      </div>

      {/* CURRENT OWNER */}
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <div className="text-sm font-semibold text-gray-700">
          Current Owner
        </div>
        <div className="font-mono text-sm break-all">
          {owner ?? "Loading..."}
        </div>

        {isOwner ? (
          <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-700">
            You are the owner
          </span>
        ) : (
          <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
            Read only
          </span>
        )}
      </div>

      {/* TRANSFER */}
      {isOwner && (
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-700">
            Transfer Ownership
          </div>

          <input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border px-4 py-2 font-mono text-sm"
          />

          <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
            ⚠️ Setelah ownership dipindahkan:
            <ul className="list-disc pl-4 mt-1">
              <li>Kamu kehilangan semua hak admin</li>
              <li>Tidak bisa revoke / grant role</li>
              <li>Tidak bisa set actor</li>
            </ul>
          </div>

          <button
            onClick={transferOwnership}
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Transfer Ownership"}
          </button>
        </div>
      )}
    </div>
  );
}
