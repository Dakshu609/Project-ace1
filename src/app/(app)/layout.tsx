import { Navbar } from "@/client/components/layout/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-muted/10">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
