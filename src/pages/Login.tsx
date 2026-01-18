import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCanLogin } from "../web3/useGamboengRead";
import logo from "../assets/smartevxgambung.png";

export default function Login() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const { data: canLogin, isLoading, isError } = useCanLogin(address);

  const [ready, setReady] = useState(false);

  // 🧠 Wallet connect → cek akses → tampilkan tombol
  useEffect(() => {
    if (isConnected && canLogin !== undefined) {
      setReady(true);
    }
  }, [isConnected, canLogin]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 flex items-center justify-center px-6">

      {/* ================= BACK TO LANDING ================= */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Kembali</span>
      </Link>

      {/* ================= CONTAINER ================= */}
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT (HERO) ================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={logo}
              alt="Gamboeng Traceability"
              className="h-16 w-auto object-contain drop-shadow-md"
            />

            <div className="leading-tight">
              <div className="text-xl font-semibold">
                Gamboeng Traceability
              </div>
              <div className="text-xs text-white/80">
                Blockchain-based Supply Chain
              </div>
            </div>
          </div>


          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Masuk ke Sistem <br /> Traceability Teh
          </h1>

          <p className="text-white/90 text-sm md:text-base max-w-md">
            Akses dashboard untuk mengelola proses produksi, transfer,
            dan penelusuran lot berbasis blockchain.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/90">
            <li>✔ Login berbasis wallet</li>
            <li>✔ Validasi role dari smart contract</li>
            <li>✔ Data transparan & tidak dapat dimanipulasi</li>
          </ul>
        </div>

        {/* ================= RIGHT (LOGIN) ================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Login Wallet
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Hubungkan wallet Anda untuk melanjutkan
          </p>

          {/* CONNECT BUTTON */}
          <div className="mb-4">
            <ConnectKitButton />
          </div>

          {/* STATUS */}
          <div className="min-h-[56px] space-y-2">
            {isConnected && isLoading && (
              <div className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
                Mengecek akses wallet...
              </div>
            )}

            {isConnected && canLogin === false && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                Wallet tidak memiliki role / belum aktif
              </div>
            )}

            {isError && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                Gagal menghubungi smart contract
              </div>
            )}
          </div>

          {/* ================= ACTION BUTTON ================= */}
          {ready && canLogin === true && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 h-11 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
            >
              Masuk ke Dashboard
            </button>
          )}

          {ready && canLogin === false && (
            <button
              disabled
              className="mt-6 h-11 rounded-xl bg-gray-300 text-gray-600 text-sm font-medium cursor-not-allowed"
            >
              Akses Ditolak
            </button>
          )}

          <p className="mt-8 text-xs text-gray-400">
            Sistem menggunakan autentikasi wallet dan validasi role
            berbasis smart contract Ethereum.
          </p>
        </div>
      </div>
    </div>
  );
}
