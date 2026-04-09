import BottomNavbar from "@/components/layout/BottomNavbar";
import Navbar from "@/components/layout/Navbar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Desktop navbar */}
      <div>
        <Navbar />
      </div>
      {/* page content */}
      <main className=" md:pb-0 flex-1 overflow-hidden">{children}</main>

      {/* mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-orange-500">
        <BottomNavbar />
      </div>
    </div>
  );
}
