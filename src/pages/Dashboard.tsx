import { useReadContract } from "wagmi";
import { gamboengAbi } from "../contracts/gamboengAbi";
import { GAMBOENG_ADDRESS } from "../contracts/address";

/* ================= CARD ================= */

function Card({
  title,
  value,
  green,
  subtitle,
}: {
  title: string;
  value: string;
  green?: boolean;
  subtitle?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl p-6 shadow-sm
        ${
          green
            ? "bg-gradient-to-br from-green-600 to-green-700 text-white"
            : "bg-white"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <p className={`text-sm ${green ? "text-green-100" : "text-gray-400"}`}>
          {title}
        </p>
        <span className="text-xs opacity-70">↗</span>
      </div>

      <p className="text-3xl font-semibold mt-4">{value}</p>

      {subtitle && (
        <p
          className={`text-xs mt-2 ${
            green ? "text-green-100" : "text-gray-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const { data: lotCount } = useReadContract({
    address: GAMBOENG_ADDRESS,
    abi: gamboengAbi,
    functionName: "lotCount",
  });

  const { data: transferCount } = useReadContract({
    address: GAMBOENG_ADDRESS,
    abi: gamboengAbi,
    functionName: "transferCount",
  });

  const { data: finishedCount } = useReadContract({
    address: GAMBOENG_ADDRESS,
    abi: gamboengAbi,
    functionName: "finishedCount",
  });

  const { data: owner } = useReadContract({
    address: GAMBOENG_ADDRESS,
    abi: gamboengAbi,
    functionName: "owner",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Monitor production & traceability in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Total Lots"
          value={lotCount ? lotCount.toString() : "—"}
          green
          subtitle="Recorded on blockchain"
        />

        <Card
          title="Total Transfers"
          value={transferCount ? transferCount.toString() : "—"}
          subtitle="Ownership changes"
        />

        <Card
          title="Finished Products"
          value={finishedCount ? finishedCount.toString() : "—"}
          subtitle="Packed products"
        />

        <Card
          title="Contract Owner"
          value={
            owner
              ? `${owner.slice(0, 6)}…${owner.slice(-4)}`
              : "—"
          }
          subtitle="Smart contract owner"
        />
      </div>
    </div>
  );
}
