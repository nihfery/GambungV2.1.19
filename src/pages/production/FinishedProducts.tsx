import { useEffect, useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";

type Address = `0x${string}`;

interface FinishedLot {
  id: string;
  step: Step;
  actor: Address;
  quantity: bigint;
  timestamp: bigint;
}

/* ================= HELPERS ================= */

function shortAddress(addr: Address) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ================= COMPONENT ================= */

export default function FinishedProducts() {
  const publicClient = usePublicClient();

  const [lots, setLots] = useState<FinishedLot[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FINISHED LOTS ================= */

  const loadFinishedLots = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);
    try {
      // 🔑 SOLUSI UTAMA
      const lotIds = (await publicClient.readContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "getAllLotIds",
      })) as string[];

      const result: FinishedLot[] = [];

      for (const lotId of lotIds) {
        const data = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "lots",
          args: [lotId],
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

        const exists = data[5];
        const finished = data[6];

        if (!exists || !finished) continue;

        result.push({
          id: data[0],
          step: data[1],
          actor: data[2],
          quantity: data[3],
          timestamp: data[7],
        });
      }

      setLots(result.reverse());
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadFinishedLots();
  }, [loadFinishedLots]);

  if (loading) {
    return (
      <p className="text-gray-400">
        Loading finished products...
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-semibold">
          Finished Products
        </h1>
        <p className="text-gray-400 mt-1">
          Final packed products ready for distribution
        </p>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Lot ID</th>
              <th className="px-4 py-3 text-left">Step</th>
              <th className="px-4 py-3 text-left">Actor</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Finished At</th>
            </tr>
          </thead>

          <tbody>
            {lots.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No finished products yet
                </td>
              </tr>
            )}

            {lots.map((lot) => (
              <tr key={lot.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {lot.id}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-md bg-green-600 px-2 py-1 text-xs text-white">
                    {stepLabels[lot.step]}
                  </span>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {shortAddress(lot.actor)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {lot.quantity.toString()}
                </td>

                <td className="px-4 py-3 text-right text-xs text-gray-400">
                  {new Date(
                    Number(lot.timestamp) * 1000
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
