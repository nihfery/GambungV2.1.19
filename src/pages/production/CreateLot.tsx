import { useState } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";

export default function CreateLot() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [lotId, setLotId] = useState("");
  const [qty, setQty] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!walletClient || !publicClient) {
      setError("Wallet belum terhubung");
      return;
    }

    if (!lotId.trim()) {
      setError("Lot ID wajib diisi");
      return;
    }

    if (!qty || Number(qty) <= 0) {
      setError("Quantity harus lebih dari 0");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "createPluckingLot",
        args: [lotId.trim(), BigInt(qty), meta.trim()],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // reset form
      setLotId("");
      setQty("");
      setMeta("");
    } catch (err: any) {
      console.error(err);
      setError("Gagal membuat lot. Pastikan Anda punya role Plucking.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8 max-w-xl">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-semibold">Create Lot</h1>
        <p className="text-gray-400 mt-1">
          Create new production lot (Plucking stage)
        </p>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
        {/* ERROR */}
        {error && (
          <div className="rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* LOT ID */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Lot ID
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm
              focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g LOT-PLUCK-001"
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* QTY */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border px-3 py-2 text-sm
              focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g 100"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* META */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Meta / Notes
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm resize-none
              focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Optional notes"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className={`
            w-full py-2.5 rounded-xl font-medium text-sm
            transition-colors
            ${
              loading
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          `}
        >
          {loading ? "Creating Lot..." : "Create Lot"}
        </button>
      </div>
    </div>
  );
}
