import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(true);     // desktop
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  // detect resize
  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= 768);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // sidebar REAL width (hover aware)
  const sidebarWidth =
    collapsed && !hoverExpanded ? 80 : 256;

  function toggleSidebar() {
    if (!isDesktop) {
      setSidebarOpen((o) => !o);     // mobile drawer
    } else {
      setCollapsed((c) => !c);       // desktop collapse
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onHoverChange={setHoverExpanded}
      />

      {/* MAIN AREA */}
      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: isDesktop ? `${sidebarWidth}px` : "0px",
        }}
      >
        <Navbar onMenuClick={toggleSidebar} />

        <main className="flex-1 px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
