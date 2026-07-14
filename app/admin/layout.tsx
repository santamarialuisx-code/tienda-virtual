import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel de administración de Tienda Virtual",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
