import { useState } from "react";
import { usePublicClient } from "wagmi";

import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import { QRCodeCanvas } from "qrcode.react";

import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";
import TraceNode from "./TraceNode";

type Address = `0x${string}`;

interface LotView {
  id: string;
  step: Step;
  actor: Address;
  quantity: bigint;
  parentIds: string[];
  meta: string;
  finished: boolean;
  timestamp: bigint;
}

const nodeTypes = {
  trace: TraceNode,
};

export default function Traceability() {
  const publicClient = usePublicClient();

  const [lotId, setLotId] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ URL untuk QR
  const traceUrl = lotId
    ? `${window.location.origin}/trace/${lotId}`
    : "";

  async function trace() {
    if (!publicClient || !lotId) return;
    setLoading(true);

    try {
      // 1️⃣ Ambil trace chain
      const chain = (await publicClient.readContract({
        address: GAMBOENG_ADDRESS,
        abi: gamboengAbi,
        functionName: "traceLot",
        args: [lotId],
      })) as LotView[];

      // parent → child (kiri → kanan)
      const ordered = [...chain].reverse();

      const createdNodes: Node[] = [];
      const createdEdges: Edge[] = [];

      for (let i = 0; i < ordered.length; i++) {
        const lot = ordered[i];

        // 2️⃣ Ambil actor info (mapping public → tuple)
        const actorInfo = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "actors",
          args: [lot.actor],
        })) as readonly [string, string, boolean];

        const [actorName] = actorInfo;

        // 3️⃣ Node
        createdNodes.push({
          id: lot.id,
          type: "trace",
          position: {
            x: i * 320,
            y: 200,
          },
          data: {
            id: lot.id,
            stepLabel: stepLabels[lot.step],
            quantity: lot.quantity.toString(),
            actor: lot.actor,
            actorName,
            meta: lot.meta,
            finished: lot.finished,
            time: new Date(
              Number(lot.timestamp) * 1000
            ).toLocaleString(),
          },
        });

        // 4️⃣ Edge (hanya kalau ada parent)
        if (lot.parentIds && lot.parentIds.length > 0) {
          lot.parentIds.forEach((parentId) => {
            createdEdges.push({
              id: `${parentId}-${lot.id}`,
              source: parentId,
              target: lot.id,
              animated: true,
              style: {
                stroke: "#22c55e",
                strokeWidth: 2,
              },
            });
          });
        }
      }

      setNodes(createdNodes);
      setEdges(createdEdges);
    } catch (err) {
      console.error("Trace error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Traceability</h1>
        <p className="text-gray-400">
          Visual traceability from blockchain data
        </p>
      </div>

      {/* INPUT */}
      <div className="flex gap-3 max-w-xl">
        <input
          value={lotId}
          onChange={(e) => setLotId(e.target.value)}
          placeholder="Enter Lot ID (ex: LOT-TX-01-A)"
          className="flex-1 rounded-lg border px-4 py-2"
        />
        <button
          onClick={trace}
          disabled={loading}
          className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Tracing..." : "Trace"}
        </button>
      </div>

      {/* ✅ QR CODE */}
      {lotId && (
        <div className="max-w-xl rounded-xl border bg-white p-6 space-y-4">
          <div className="text-sm font-semibold text-gray-700">
            QR Code untuk Konsumen
          </div>

          <div className="flex justify-center">
            <QRCodeCanvas
              value={traceUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
          </div>

          <div className="text-center text-xs text-gray-500 break-all">
            {traceUrl}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                const canvas = document.querySelector("canvas");
                if (!canvas) return;

                const link = document.createElement("a");
                link.download = `trace-${lotId}.png`;
                link.href = canvas.toDataURL();
                link.click();
              }}
              className="text-xs text-green-600 hover:underline"
            >
              Unduh QR Code
            </button>
          </div>
        </div>
      )}

      {/* FLOW */}
      <div className="h-[650px] rounded-xl border bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
