import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon,
  KeyIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import logo from "../../assets/smartevxgambung.png";


/* ================= TYPES ================= */

type MenuChild = {
  label: string;
  to: string;
};

type MenuItem = {
  label: string;
  icon: any;
  to?: string;
  children?: MenuChild[];
};

/* ================= MENU CONFIG ================= */

const menu: MenuItem[] = [
  { label: "Dashboard", icon: HomeIcon, to: "/dashboard" },

  {
    label: "User & Role",
    icon: UsersIcon,
    children: [
      { label: "Actor Management", to: "/dashboard/roles/actors" },
    ],
  },

  {
    label: "Production",
    icon: CubeIcon,
    children: [
      {
        label: "Create Lot",
        to: "/dashboard/production/create-lot",
      },
      {
        label: "Lot List",
        to: "/dashboard/production/lots",
      },
      {
        label: "Finished Products",
        to: "/dashboard/production/finished-products",
      },
    ],
  },

  {
    label: "Transfer Process",
    icon: ArrowsRightLeftIcon,
    children: [
      {
        label: "Propose Transfer",
        to: "/dashboard/transfer/propose",
      },
      {
        label: "Incoming Transfers",
        to: "/dashboard/transfer/incoming",
      },
    ],
  },

  {
    label: "Trace & Audit",
    icon: ClipboardDocumentListIcon,
    children: [
      { label: "Traceability", to: "/dashboard/trace" },
    ],
  },

  {
    label: "System",
    icon: KeyIcon,
    children: [
      { label: "Ownership", to: "/dashboard/ownership" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Sidebar({
  open,
  collapsed,
  onClose,
  onHoverChange,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onHoverChange: (v: boolean) => void;
}) {
  const { pathname } = useLocation();

  const [hovering, setHovering] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const isMobile = window.innerWidth < 768;
  const expanded = isMobile ? open : !collapsed || hovering;

  /* ===== INFORM LAYOUT (WIDTH SYNC) ===== */
  useEffect(() => {
    onHoverChange(expanded);
  }, [expanded, onHoverChange]);

  /* ===== RESET GROUP WHEN COLLAPSE ===== */
  useEffect(() => {
    if (!expanded) setOpenGroup(null);
  }, [expanded]);

  /* ===== ACTIVE HELPERS ===== */

  function isDashboardActive() {
    return pathname === "/dashboard";
  }

  function isChildActive(to: string) {
    return pathname === to || pathname.startsWith(to + "/");
  }

  function isGroupActive(children?: MenuChild[]) {
    return children?.some((c) => isChildActive(c.to));
  }

  function toggleGroup(label: string) {
    setOpenGroup((prev) => (prev === label ? null : label));
  }

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        onMouseEnter={() => !isMobile && setHovering(true)}
        onMouseLeave={() => !isMobile && setHovering(false)}
        className={`
          fixed inset-y-0 left-0 z-40
          bg-white border-r
          transition-all duration-300 ease-in-out
          flex flex-col
          ${expanded ? "w-64" : "w-20"}
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ===== LOGO ===== */}
<div className="h-16 flex items-center justify-center border-b shrink-0">
  <img
    src={logo}
    alt="Gamboeng Logo"
    className={`
      transition-all duration-300
      ${expanded ? "h-28 w-auto" : "h-13 w-auto"}
      object-contain
    `}
  />
</div>


        {/* ===== MENU ===== */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((m) => {
            const Icon = m.icon;

            /* ===== SINGLE MENU ===== */
            if (m.to) {
              const active =
                m.to === "/dashboard"
                  ? isDashboardActive()
                  : isChildActive(m.to);

              return (
                <NavLink
                  key={m.label}
                  to={m.to}
                  onClick={() => isMobile && onClose()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    transition-colors
                    ${
                      active
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {expanded && <span>{m.label}</span>}
                </NavLink>
              );
            }

            /* ===== GROUP MENU ===== */
            const groupActive = isGroupActive(m.children);
            const groupOpen = expanded && openGroup === m.label;

            return (
              <div key={m.label}>
                <button
                  onClick={() => expanded && toggleGroup(m.label)}
                  className={`
                    flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm
                    transition-colors
                    ${
                      groupActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {expanded && (
                    <>
                      <span className="flex-1 text-left">{m.label}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          groupOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {/* ===== SUB MENU ===== */}
                {groupOpen && (
                  <div className="ml-10 mt-1 space-y-1">
                    {m.children!.map((c) => {
                      const subActive = isChildActive(c.to);

                      return (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          onClick={() => isMobile && onClose()}
                          className={`
                            block px-3 py-1.5 rounded-lg text-sm
                            transition-colors
                            ${
                              subActive
                                ? "bg-green-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                          `}
                        >
                          {c.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ===== FOOTER ===== */}
        {expanded && (
          <div className="shrink-0 border-t py-3 text-center text-xs text-gray-400">
            v.Beta • Gamboeng Traceability
          </div>
        )}
      </aside>
    </>
  );
}
