import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import TraceNode from "../trace/TraceNode";

/* ================= TYPES ================= */

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

/* ================= NODE TYPES ================= */

const nodeTypes = {
  trace: TraceNode,
};

/* ================= COMPONENT ================= */

export default function PublicTrace() {
  const { lotId } = useParams<{ lotId: string }>();
  const publicClient = usePublicClient();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);

  const traceUrl = `${window.location.origin}/trace/${lotId}`;

  useEffect(() => {
    async function load() {
      if (!publicClient || !lotId) return; // ✅ TYPE SAFE

      setLoading(true);

      try {
        /* 1️⃣ Ambil trace chain */
        const chain = (await publicClient.readContract({
          address: GAMBOENG_ADDRESS,
          abi: gamboengAbi,
          functionName: "traceLot",
          args: [lotId],
        })) as LotView[];

        /* parent → child (kiri → kanan) */
        const ordered = [...chain].reverse();

        const n: Node[] = [];
        const e: Edge[] = [];

        for (let i = 0; i < ordered.length; i++) {
          const lot = ordered[i];

          /* 2️⃣ Ambil actor info */
          const actorInfo = (await publicClient.readContract({
            address: GAMBOENG_ADDRESS,
            abi: gamboengAbi,
            functionName: "actors",
            args: [lot.actor],
          })) as readonly [string, string, boolean];

          const [actorName] = actorInfo;

          /* 3️⃣ Node */
          n.push({
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

          /* 4️⃣ Edge hanya jika ada parent */
          lot.parentIds.forEach((p) => {
            e.push({
              id: `${p}-${lot.id}`,
              source: p,
              target: lot.id,
              animated: true,
              style: {
                stroke: "#22c55e",
                strokeWidth: 2,
              },
            });
          });
        }

        setNodes(n);
        setEdges(e);
      } catch (err) {
        console.error("PublicTrace error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [publicClient, lotId]);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-semibold">Product Traceability</h1>
        <p className="text-gray-500">
          Blockchain-based production trace
        </p>
      </div>

      {/* QR CODE */}
      {lotId && (
        <div className="mx-auto max-w-md rounded-xl border bg-white p-6 space-y-4">
          <div className="text-sm font-semibold text-gray-700 text-center">
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
      <div className="mx-auto max-w-6xl h-[650px] rounded-xl border bg-white">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Loading trace…
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background gap={18} />
            <Controls />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
