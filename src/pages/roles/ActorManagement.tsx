import { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { GAMBOENG_ADDRESS } from "../../contracts/address";
import { gamboengAbi } from "../../contracts/gamboengAbi";
import { Step, stepLabels } from "../../lib/types";

type Address = `0x${string}`;

interface Actor {
  address: Address;
  name: string;
  status: string;
  active: boolean;
  roles: Step[];
}

/* ================= CONSTANT ================= */

const STORAGE_KEY = "gamboeng_actor_addresses";

const STEPS = Object.values(Step).filter(
  (v) => typeof v === "number"
) as Step[];

/* ================= HELPERS ================= */

function shortAddress(addr: Address) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ================= COMPONENT ================= */

export default function ActorManagement() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  /* ================= STORAGE ================= */

  function getStoredActors(): Address[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveActor(addr: Address) {
    const list = getStoredActors();
    if (!list.includes(addr)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, addr]));
    }
  }

  /* ================= LOAD ACTORS ================= */

  const loadActors = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);

    try {
      const addresses = getStoredActors();
      const result: Actor[] = [];

      for (const addr of addresses) {
        const [name, status, active] =
          (await publicClient.readContract({
            address: GAMBOENG_ADDRESS,
            abi: gamboengAbi,
            functionName: "actors",
            args: [addr],
          })) as readonly [string, string, boolean];

        if (!name) continue;

        const roles: Step[] = [];

        for (const step of STEPS) {
          const has = (await publicClient.readContract({
            address: GAMBOENG_ADDRESS,
            abi: gamboengAbi,
            functionName: "hasRole",
            args: [step, addr],
          })) as boolean;

          if (has) roles.push(step);
        }

        result.push({
          address: addr,
          name,
          status,
          active,
          roles,
        });
      }

      setActors(result);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadActors();
  }, [loadActors]);

  /* ================= ACTIONS ================= */

  async function addActor() {
    if (!walletClient || !publicClient) return;
    if (!wallet.startsWith("0x")) return;

    const addr = wallet as Address;

    const hash = await walletClient.writeContract({
      address: GAMBOENG_ADDRESS,
      abi: gamboengAbi,
      functionName: "setActor",
      args: [addr, name, status, true],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    saveActor(addr);
    setWallet("");
    setName("");
    setStatus("");
    loadActors();
  }

  async function toggleActive(actor: Actor) {
    if (!walletClient || !publicClient) return;

    const hash = await walletClient.writeContract({
      address: GAMBOENG_ADDRESS,
      abi: gamboengAbi,
      functionName: "setActor",
      args: [actor.address, actor.name, actor.status, !actor.active],
    });

    await publicClient.waitForTransactionReceipt({ hash });
    loadActors();
  }

  async function grantRole(actor: Actor, step: Step) {
    if (!walletClient || !publicClient) return;

    const hash = await walletClient.writeContract({
      address: GAMBOENG_ADDRESS,
      abi: gamboengAbi,
      functionName: "grantRole",
      args: [step, actor.address],
    });

    await publicClient.waitForTransactionReceipt({ hash });
    loadActors();
  }

  async function revokeRole(actor: Actor, step: Step) {
    if (!walletClient || !publicClient) return;

    const hash = await walletClient.writeContract({
      address: GAMBOENG_ADDRESS,
      abi: gamboengAbi,
      functionName: "revokeRole",
      args: [step, actor.address],
    });

    await publicClient.waitForTransactionReceipt({ hash });
    loadActors();
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Actor Management</h1>
        <p className="text-gray-400 mt-1">
          Manage actors and production roles.
        </p>
      </div>

      {/* ADD ACTOR */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          Tambah Actor
        </h2>

        <div className="space-y-3">
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Wallet Address (0x...)"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />

          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Nama Actor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="Status (Pegawai Tetap / Kontrak / Mitra)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <button
            onClick={addActor}
            className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Tambah Actor
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Wallet</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Aktif</th>
              <th className="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {actors.map((actor) => (
              <tr key={actor.address} className="border-t">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {shortAddress(actor.address)}
                </td>
                <td className="px-4 py-3 font-medium">{actor.name}</td>
                <td className="px-4 py-3 text-gray-600">{actor.status}</td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {actor.roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700"
                      >
                        {stepLabels[r]}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-1 text-xs ${
                      actor.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {actor.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>

                <td className="px-4 py-3 space-y-2">
                  <button
                    onClick={() => toggleActive(actor)}
                    className="w-full rounded-lg border px-3 py-1.5 text-xs hover:bg-green-50 transition"
                  >
                    {actor.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <div className="grid grid-cols-2 gap-1">
                    {STEPS.map((step) =>
                      actor.roles.includes(step) ? (
                        <button
                          key={step}
                          onClick={() => revokeRole(actor, step)}
                          className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 transition"
                        >
                          Revoke {stepLabels[step]}
                        </button>
                      ) : (
                        <button
                          key={step}
                          disabled={!actor.active}
                          onClick={() => grantRole(actor, step)}
                          className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200 transition disabled:opacity-50"
                        >
                          Grant {stepLabels[step]}
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
