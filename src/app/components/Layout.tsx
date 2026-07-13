import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] font-sans text-zinc-900 selection:bg-yellow-500/30 selection:text-zinc-900">
      <Outlet />
    </div>
  );
}
