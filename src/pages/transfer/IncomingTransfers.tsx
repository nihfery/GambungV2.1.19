import { useEffect, useState } from "react";
import {
  usePublicClient,
  useWalletClient,
  useAccount,
} from "wagmi";

import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";

type Address = `0x${string}`;

interface IncomingTransfer {
  id: string;
  from: Address;
  to: Address;
  step: Step;
  quantity: bigint;
  accepted: boolean;
  cancelled: boolean;
}

function short(addr: Address) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function IncomingTransfers() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [data, setData] = useState<IncomingTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState<string | null>(null);

  async function loadTransfers() {
    if (!publicClient || !address) return;

    setLoading(true);
    try {
      /** 1️⃣ ambil semua transferId */
      const ids = (await publicClient.readContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "getAllTransferIds",
      })) as string[];

      /** 2️⃣ ambil detail */
      const rows: IncomingTransfer[] = [];

      for (const id of ids) {
        const t = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "getTransfer",
          args: [id],
        })) as any;

        rows.push({
          id: t.id,
          from: t.from,
          to: t.to,
          step: t.toStep,
          quantity: t.quantity,
          accepted: t.accepted,
          cancelled: t.cancelled,
        });
      }

      /** 3️⃣ filter incoming */
      const incoming = rows.filter(
        (t) =>
          !t.accepted &&
          !t.cancelled &&
          t.to.toLowerCase() === address.toLowerCase()
      );

      setData(incoming.reverse());
    } catch (err) {
      console.error("IncomingTransfers error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransfers();
  }, [publicClient, address]);

  /* ================= ACTIONS ================= */

  async function acceptTransfer(id: string) {
    if (!walletClient) return;

    try {
      setTxLoading(id);

      const newLotId = `LOT-${id}`; // bebas, asal unik
      const meta = "Accepted via dashboard";

      const hash = await walletClient.writeContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "acceptTransfer",
        args: [id, newLotId, meta],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      await loadTransfers();
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setTxLoading(null);
    }
  }

  async function rejectTransfer(id: string) {
    if (!walletClient) return;

    try {
      setTxLoading(id);

      const hash = await walletClient.writeContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "cancelTransfer",
        args: [id],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      await loadTransfers();
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setTxLoading(null);
    }
  }

  /* ================= UI ================= */

  if (loading) {
    return <p className="text-gray-400">Loading incoming transfers…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Incoming Transfers</h1>
        <p className="text-gray-400">
          Transfers waiting for your confirmation
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Transfer ID</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">Step</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No incoming transfers
                </td>
              </tr>
            )}

            {data.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {short(t.from)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                    {stepLabels[t.step]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {t.quantity.toString()}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    disabled={txLoading === t.id}
                    onClick={() => acceptTransfer(t.id)}
                    className="rounded bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Accept
                  </button>

                  <button
                    disabled={txLoading === t.id}
                    onClick={() => rejectTransfer(t.id)}
                    className="rounded bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
