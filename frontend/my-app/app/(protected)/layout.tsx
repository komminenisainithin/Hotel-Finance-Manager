import AuthGuard from "../components/AuthGuard";
import DesktopSidebar from "../components/desktopSidebar";
import MobilebottomBar from "../components/MobilebottomBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <main className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-0">
          {children}
        </main>
        <MobilebottomBar />
      </div>
    </AuthGuard>
  );
}
