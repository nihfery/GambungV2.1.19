import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import ActorManagement from "./pages/roles/ActorManagement";

// ===== PRODUCTION =====
import CreateLot from "./pages/production/CreateLot";
import LotList from "./pages/production/LotList";
import FinishedProducts from "./pages/production/FinishedProducts";

// ===== TRANSFER =====
import ProposeTransfer from "./pages/transfer/ProposeTransfer";
import IncomingTransfers from "./pages/transfer/IncomingTransfers";

// ===== TRACE =====
import Traceability from "./pages/trace/Traceability";
import PublicTrace from "./pages/trace/PublicTrace"; // ✅ PUBLIC PAGE

import Ownership from "./pages/system/Ownership";

// ===== ROUTE GUARD =====
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ PUBLIC TRACE (UNTUK QR / KONSUMEN) */}
        <Route path="/trace/:lotId" element={<PublicTrace />} />

        {/* ================= PROTECTED ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="roles">
              <Route path="actors" element={<ActorManagement />} />
            </Route>

            <Route path="production">
              <Route path="create-lot" element={<CreateLot />} />
              <Route path="lots" element={<LotList />} />
              <Route
                path="finished-products"
                element={<FinishedProducts />}
              />
            </Route>

            <Route path="transfer">
              <Route path="propose" element={<ProposeTransfer />} />
              <Route path="incoming" element={<IncomingTransfers />} />
            </Route>

            <Route path="trace" element={<Traceability />} />

            <Route path="ownership" element={<Ownership />} />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
