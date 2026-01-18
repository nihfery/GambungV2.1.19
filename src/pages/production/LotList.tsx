import { useEffect, useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";

type Address = `0x${string}`;

interface Lot {
  id: string;
  step: Step;
  actor: Address;
  quantity: bigint;
  finished: boolean;
  timestamp: bigint;
}

/* ================= HELPERS ================= */

function shortAddress(addr: Address) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ================= COMPONENT ================= */

export default function LotList() {
  const publicClient = usePublicClient();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD LOTS ================= */

  const loadLots = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);
    try {
      // 🔥 AMBIL SEMUA LOT ID DARI CONTRACT
      const lotIds = (await publicClient.readContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "getAllLotIds",
      })) as string[];

      const result: Lot[] = [];

      for (const id of lotIds) {
        const data = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "lots",
          args: [id],
        })) as readonly [
          string,
          Step,
          Address,
          bigint,
          string,
          boolean,
          boolean,
          bigint
        ];

        if (!data[5]) continue; // exists == false

        result.push({
          id: data[0],
          step: data[1],
          actor: data[2],
          quantity: data[3],
          finished: data[6],
          timestamp: data[7],
        });
      }

      setLots(result.reverse());
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    loadLots();
  }, [loadLots]);

  if (loading) {
    return <p className="text-gray-400">Loading lots...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Lot List</h1>
        <p className="text-gray-400 mt-1">
          All production lots recorded on blockchain.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Lot ID</th>
              <th className="px-4 py-3 text-left">Step</th>
              <th className="px-4 py-3 text-left">Actor</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {lots.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No lots found
                </td>
              </tr>
            )}

            {lots.map((lot) => (
              <tr key={lot.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {lot.id}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">
                    {stepLabels[lot.step]}
                  </span>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {shortAddress(lot.actor)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {lot.quantity.toString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-md px-2 py-1 text-xs ${
                      lot.finished
                        ? "bg-gray-200 text-gray-600"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {lot.finished ? "Finished" : "Active"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right text-xs text-gray-400">
                  {new Date(Number(lot.timestamp) * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
