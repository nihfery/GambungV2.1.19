import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { useCanLogin } from "../web3/useGamboengRead";

export default function ProtectedRoute() {
  const { address, isConnected, status } = useAccount();

  const { data: canLogin, isLoading } = useCanLogin(address, {
    enabled: Boolean(address),
  });

  // ⏳ tunggu wagmi & RPC
  if (
    status === "connecting" ||
    status === "reconnecting" ||
    isLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memulihkan sesi wallet...
      </div>
    );
  }

  // ❌ belum connect
  if (!isConnected || !address) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ canLogin belum pasti
  if (canLogin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memverifikasi akses...
      </div>
    );
  }

  // ❌ tidak punya role
  if (canLogin === false) {
    return <Navigate to="/login" replace />;
  }

  // ✅ aman
  return <Outlet />;
}
