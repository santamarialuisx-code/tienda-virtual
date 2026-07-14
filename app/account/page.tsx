import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/helpers";
import { client } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/config";

export default async function AccountPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/auth/login");
  }
  
  // Fetch user details from Sanity
  const query = `*[_type == "user" && _id == $id][0] {
    _id,
    email,
    name,
    role,
    createdAt
  }`;
  
  const user = await client.fetch<{
    _id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  }>(query, { id: session.user.id });
  
  if (!user) {
    redirect("/auth/login");
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Mi Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Información Personal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Nombre
                </p>
                <p className="text-sm">{user.name || "No especificado"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Correo electrónico
                </p>
                <p className="text-sm">{user.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Rol
                </p>
                <p className="text-sm">
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Miembro desde
                </p>
                <p className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString("es-VE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-muted" />
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Acciones</h2>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/account/orders">
                <Button variant="outline">Ver Mis Pedidos</Button>
              </Link>
              
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <Button type="submit" variant="destructive">
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}