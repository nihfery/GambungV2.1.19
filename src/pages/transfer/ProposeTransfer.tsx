import { useState } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";

type Address = `0x${string}`;

export default function ProposeTransfer() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [transferId, setTransferId] = useState("");
  const [lotIdsText, setLotIdsText] = useState("");
  const [to, setTo] = useState("");
  const [toStep, setToStep] = useState<Step>(Step.Withering);
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!walletClient || !publicClient || !address) return;

    if (!transferId || !lotIdsText || !to || !qty) {
      alert("Semua field wajib diisi");
      return;
    }

    // 🔥 string → string[]
    const lotIds = lotIdsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (lotIds.length === 0) {
      alert("Minimal 1 Lot ID");
      return;
    }

    setLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "proposeTransfer",
        args: [
          transferId,           // string
          lotIds,               // string[]
          to as Address,        // address
          toStep,               // uint8 (enum Step)
          BigInt(qty),          // uint256
        ] as const,              // 🔥 PENTING
      });

      await publicClient.waitForTransactionReceipt({ hash });

      // reset form
      setTransferId("");
      setLotIdsText("");
      setTo("");
      setQty("");
      setToStep(Step.Withering);

      alert("Transfer berhasil diajukan");
    } catch (err: any) {
      console.error(err);
      alert(err?.shortMessage || err?.message || "Gagal propose transfer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Propose Transfer</h1>
        <p className="text-gray-400 mt-1">
          Ajukan transfer lot ke aktor berikutnya
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <input
          className="input w-full"
          placeholder="Transfer ID (contoh: TR-001)"
          value={transferId}
          onChange={(e) => setTransferId(e.target.value)}
        />

        <input
          className="input w-full"
          placeholder="Lot IDs (pisahkan koma, ex: LOT-1,LOT-2)"
          value={lotIdsText}
          onChange={(e) => setLotIdsText(e.target.value)}
        />

        <input
          className="input w-full"
          placeholder="Receiver Address (0x...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <select
          className="input w-full"
          value={toStep}
          onChange={(e) => setToStep(Number(e.target.value) as Step)}
        >
          {Object.values(Step)
            .filter((v) => typeof v === "number")
            .map((s) => (
              <option key={s} value={s}>
                {stepLabels[s as Step]}
              </option>
            ))}
        </select>

        <input
          type="number"
          min={1}
          className="input w-full"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className={`
            w-full py-2 rounded-xl text-white transition
            ${loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? "Submitting..." : "Propose Transfer"}
        </button>
      </div>
    </div>
  );
}
