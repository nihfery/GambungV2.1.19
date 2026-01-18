import { Handle, Position } from "reactflow";

interface TraceNodeData {
  id: string;
  stepLabel: string;
  quantity: string;
  actor: string;
  actorName?: string;
  meta: string;
  finished: boolean;
  time: string;
}

export default function TraceNode({ data }: { data: TraceNodeData }) {
  return (
    <div className="group relative w-60 rounded-xl border bg-white px-4 py-3 shadow-sm">
      {/* MAIN INFO */}
      <div className="space-y-1 text-xs">
        <div className="font-semibold text-green-700">
          {data.stepLabel}
        </div>

        <div className="font-mono text-[11px] text-gray-800">
          {data.id}
        </div>

        <div className="text-gray-600">
          Qty: {data.quantity}
        </div>

        {data.actorName && (
          <div className="text-gray-700">
            Actor:{" "}
            <span className="font-semibold">{data.actorName}</span>
          </div>
        )}
      </div>

      {/* HOVER DETAIL */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-xl border bg-white p-4 text-xs shadow-lg opacity-0 transition group-hover:opacity-100">
        <div className="space-y-2">
          <div>
            <div className="font-semibold">Actor Address</div>
            <div className="break-all font-mono text-gray-600">
              {data.actor}
            </div>
          </div>

          <div>
            <div className="font-semibold">Meta</div>
            <div className="text-gray-600">
              {data.meta || "-"}
            </div>
          </div>

          <div>
            <div className="font-semibold">Timestamp</div>
            <div className="text-gray-600">
              {data.time}
            </div>
          </div>

          <div>
            <div className="font-semibold">Status</div>
            {data.finished ? (
              <span className="text-green-600">Finished</span>
            ) : (
              <span className="text-yellow-600">In Progress</span>
            )}
          </div>
        </div>
      </div>

      {/* HANDLES */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
