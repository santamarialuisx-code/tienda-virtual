import type { StructureBuilder } from "sanity/structure";
import { DashboardTool } from "./components/DashboardTool";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Panel de Administración")
    .items([
      // Dashboard
      S.listItem()
        .title("Dashboard")
        .icon(() => "📊")
        .child(
          S.component(DashboardTool)
            .title("Dashboard")
        ),

      S.divider(),

      // Products
      S.listItem()
        .title("Productos")
        .icon(() => "📦")
        .child(
          S.documentTypeList("product")
            .title("Productos")
            .defaultOrdering([
              { field: "createdAt", direction: "desc" },
            ])
        ),

      // Categories
      S.listItem()
        .title("Categorías")
        .icon(() => "🏷️")
        .child(
          S.documentTypeList("category")
            .title("Categorías")
            .defaultOrdering([
              { field: "sortOrder", direction: "asc" },
            ])
        ),

      S.divider(),

      // Orders
      S.listItem()
        .title("Pedidos")
        .icon(() => "🛒")
        .child(
          S.documentTypeList("order")
            .title("Pedidos")
            .defaultOrdering([
              { field: "createdAt", direction: "desc" },
            ])
        ),

      // Users
      S.listItem()
        .title("Usuarios")
        .icon(() => "👤")
        .child(
          S.documentTypeList("user")
            .title("Usuarios")
            .defaultOrdering([
              { field: "createdAt", direction: "desc" },
            ])
        ),

      S.divider(),

      // Settings
      S.listItem()
        .title("Configuración")
        .icon(() => "⚙️")
        .child(
          S.documentTypeList("storeSettings")
            .title("Configuración de Tienda")
        ),

      // Hidden types (orderItem, productVariant - managed within their parents)
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "product",
            "category",
            "order",
            "user",
            "storeSettings",
          ].includes(item.getId()!)
      ),
    ]);
