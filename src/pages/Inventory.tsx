import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatusBadge, StatusType } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Minus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All", "Electronics", "Clothing", "Groceries", "Stationery", "Home & Kitchen"];

const products = [
  { id: 1, name: "Wireless Mouse", code: "ELC-001", category: "Electronics", price: 1250, stock: 48, unit: "pcs", image: "🖱️" },
  { id: 2, name: "USB-C Cable 1m", code: "ELC-002", category: "Electronics", price: 450, stock: 5, unit: "pcs", image: "🔌" },
  { id: 3, name: "Cotton T-Shirt", code: "CLT-001", category: "Clothing", price: 650, stock: 0, unit: "pcs", image: "👕" },
  { id: 4, name: "A5 Notebook", code: "STN-001", category: "Stationery", price: 120, stock: 210, unit: "pcs", image: "📓" },
  { id: 5, name: "LED Desk Lamp", code: "ELC-003", category: "Electronics", price: 2100, stock: 11, unit: "pcs", image: "💡" },
  { id: 6, name: "Rice (Miniket)", code: "GRC-001", category: "Groceries", price: 85, stock: 3, unit: "kg", image: "🍚" },
  { id: 7, name: "Hand Sanitizer 500ml", code: "GRC-002", category: "Groceries", price: 180, stock: 67, unit: "pcs", image: "🧴" },
  { id: 8, name: "Steel Water Bottle", code: "HMK-001", category: "Home & Kitchen", price: 890, stock: 22, unit: "pcs", image: "🍶" },
  { id: 9, name: "Ballpoint Pen (10pk)", code: "STN-002", category: "Stationery", price: 150, stock: 0, unit: "pcs", image: "🖊️" },
  { id: 10, name: "Denim Jeans", code: "CLT-002", category: "Clothing", price: 1800, stock: 8, unit: "pcs", image: "👖" },
];

function getStockStatus(stock: number): StatusType {
  if (stock === 0) return "outofstock";
  if (stock <= 10) return "lowstock";
  return "instock";
}

export default function Inventory() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <PageLayout title="Inventory" searchPlaceholder="Search products by name or code...">
      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border min-h-[36px]",
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
        <button className="h-8 w-8 rounded-full border-2 border-dashed border-primary/40 text-primary flex items-center justify-center hover:bg-primary/5 transition-colors flex-shrink-0">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Table header with Add Product */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {products.length} products
        </p>
        <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 ml-3">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {/* Desktop Product Table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-table-header uppercase text-muted-foreground px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-input" />
                </th>
                <th className="text-left text-table-header uppercase text-muted-foreground px-4 py-3 w-12"></th>
                <th className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">Product Name</th>
                <th className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">Category</th>
                <th className="text-right text-table-header uppercase text-muted-foreground px-4 py-3">Price</th>
                <th className="text-center text-table-header uppercase text-muted-foreground px-4 py-3">Stock</th>
                <th className="text-right text-table-header uppercase text-muted-foreground px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    i % 2 === 1 ? "bg-muted/20" : "bg-card",
                    "hover:bg-row-hover"
                  )}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-input" /></td>
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-lg">{product.image}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-table-body font-medium text-card-foreground">{product.name}</p>
                      <p className="text-badge text-muted-foreground">{product.code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{product.category}</td>
                  <td className="px-4 py-3 text-table-body text-right font-medium text-card-foreground">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={getStockStatus(product.stock)} label={`${product.stock} ${product.unit}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={cn("flex items-center justify-end gap-1 transition-opacity duration-200", hoveredRow === product.id ? "opacity-100" : "opacity-0")}>
                      <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Minus className="h-3 w-3" /></button>
                      <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Plus className="h-3 w-3" /></button>
                      <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors"><Pencil className="h-3 w-3" /></button>
                      <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing 1–{filtered.length} of {filtered.length} results</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">Previous</button>
            <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground">1</button>
            <button className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Mobile Product Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((product) => (
          <div key={product.id} className="bg-card rounded-xl p-3 flex items-center gap-3 shadow-sm border border-border">
            <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
              {product.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-card-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.code}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <div className="flex items-center justify-between mt-1">
                <StatusBadge status={getStockStatus(product.stock)} label={`${product.stock} ${product.unit}`} />
                <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <MoreVertical size={18} className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Pencil size={14} className="mr-2" /> Edit</DropdownMenuItem>
                <DropdownMenuItem><Plus size={14} className="mr-2" /> Adjust Stock</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
