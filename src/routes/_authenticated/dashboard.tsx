import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { EmployeeSidebar } from "@/components/employee/employee-sidebar";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
import { ExecutiveSidebar } from "@/components/executive/executive-sidebar";
import { ItAdminSidebar } from "@/components/it-admin/it-admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ProtectedRoute } from "@/components/auth/guards";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "OFC HR · Enterprise AI Workforce Platform" },
      {
        name: "description",
        content: "OFC HR enterprise workforce control plane and admin suite.",
      },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const role = useAuthStore((s) => s.role);

  const isEmployeePortal = role === "EMPLOYEE";
  const isManagerPortal = role === "MANAGER";
  const isExecutivePortal = role === "EXECUTIVE";
  const isItAdminPortal = role === "IT_ADMIN";

  const renderSidebar = (isMobile = false, onClose?: () => void) => {
    const props = {
      collapsed,
      isMobile,
      ...(onClose ? { onClose } : {}),
      onToggleSidebar: () => setCollapsed((prev) => !prev),
    };

    if (isEmployeePortal) {
      return <EmployeeSidebar {...props} />;
    }
    if (isManagerPortal) {
      return <ManagerSidebar {...props} />;
    }
    if (isExecutivePortal) {
      return <ExecutiveSidebar {...props} />;
    }
    if (isItAdminPortal) {
      return <ItAdminSidebar {...props} />;
    }
    return <AdminSidebar {...props} />;
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-shrink-0">
          {renderSidebar()}
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden"
              >
                {renderSidebar(true, () => setMobileOpen(false))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onOpenSidebar={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
