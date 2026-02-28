import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/utils/currency";
import { Package, ShoppingCart, ClipboardList, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

const salesData = [
  { day: "Mon", current: 12500, previous: 9800 },
  { day: "Tue", current: 18200, previous: 14500 },
  { day: "Wed", current: 15600, previous: 16200 },
  { day: "Thu", current: 22100, previous: 18700 },
  { day: "Fri", current: 19400, previous: 15300 },
  { day: "Sat", current: 28700, previous: 22100 },
  { day: "Sun", current: 16300, previous: 11800 },
];

const categoryData = [
  { name: "Electronics", qty: 145 },
  { name: "Clothing", qty: 230 },
  { name: "Groceries", qty: 312 },
  { name: "Stationery", qty: 87 },
  { name: "Home", qty: 156 },
];

const topProducts = [
  { name: "Wireless Mouse", price: 1250, qtySold: 48, revenue: 60000 },
  { name: "USB-C Cable", price: 450, qtySold: 92, revenue: 41400 },
  { name: "Notebook A5", price: 120, qtySold: 210, revenue: 25200 },
  { name: "LED Desk Lamp", price: 2100, qtySold: 11, revenue: 23100 },
  { name: "Hand Sanitizer", price: 85, qtySold: 260, revenue: 22100 },
];

const recentOrders = [
  { id: "ORD-001", customer: "Rahim Ahmed", amount: 4500, status: "paid" as const, date: "26 Feb 2026" },
  { id: "ORD-002", customer: "Fatima Begum", amount: 12300, status: "confirmed" as const, date: "26 Feb 2026" },
  { id: "ORD-003", customer: "Kamal Hossain", amount: 870, status: "partial" as const, date: "25 Feb 2026" },
  { id: "ORD-004", customer: "Nasreen Akter", amount: 6200, status: "paid" as const, date: "25 Feb 2026" },
  { id: "ORD-005", customer: "Tariq Islam", amount: 3100, status: "cancelled" as const, date: "24 Feb 2026" },
];

export default function Dashboard() {
  return (
    <PageLayout title="Dashboard" searchPlaceholder="Search products, orders, customers...">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Total Products" value="1,247" trend={{ value: "12% from last month", positive: true }} icon={Package} iconColor="text-primary" iconBg="bg-primary/10" />
        <StatCard label="Today's Sales" value={formatCurrency(28700)} trend={{ value: "8.2% from yesterday", positive: true }} icon={ShoppingCart} iconColor="text-success" iconBg="bg-success/10" />
        <StatCard label="Orders This Month" value="384" trend={{ value: "3.1% from last month", positive: false }} icon={ClipboardList} iconColor="text-secondary" iconBg="bg-secondary/10" />
        <StatCard label="Low Stock Alerts" value="23" subtitle="Items need restocking" icon={AlertTriangle} iconColor="text-warning" iconBg="bg-warning/10" />
      </div>

      {/* Row 2: Sales Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="lg:col-span-3 bg-card rounded-lg p-3 md:p-5 shadow-sm border border-border">
          <h2 className="text-sm md:text-base font-semibold text-card-foreground mb-3 md:mb-4">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={200} className="lg:!h-[280px]">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215,14%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,14%,46%)" tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="current" name="This Week" stroke="hsl(211,52%,24%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="previous" name="Last Week" stroke="hsl(215,14%,46%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-card rounded-lg p-3 md:p-5 shadow-sm border border-border">
          <h2 className="text-sm md:text-base font-semibold text-card-foreground mb-3 md:mb-4">Top Selling Products</h2>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-table-header uppercase text-muted-foreground pb-2">Product</th>
                  <th className="text-right text-table-header uppercase text-muted-foreground pb-2">Qty</th>
                  <th className="text-right text-table-header uppercase text-muted-foreground pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name} className="border-b border-border last:border-0 hover:bg-row-hover transition-colors">
                    <td className="py-2.5 text-table-body font-medium text-card-foreground">{p.name}</td>
                    <td className="py-2.5 text-table-body text-right text-muted-foreground">{p.qtySold}</td>
                    <td className="py-2.5 text-table-body text-right text-card-foreground font-medium">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile list */}
          <div className="md:hidden space-y-2">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qtySold} sold</p>
                </div>
                <p className="text-sm font-bold text-card-foreground">{formatCurrency(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Category Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-card rounded-lg p-3 md:p-5 shadow-sm border border-border">
          <h2 className="text-sm md:text-base font-semibold text-card-foreground mb-3 md:mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200} className="lg:!h-[260px]">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215,14%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,14%,46%)" />
              <Tooltip />
              <Bar dataKey="qty" name="Qty Sold" fill="hsl(211,52%,24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-3 md:p-5 shadow-sm border border-border">
          <h2 className="text-sm md:text-base font-semibold text-card-foreground mb-3 md:mb-4">Recent Orders</h2>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-table-header uppercase text-muted-foreground pb-2">Order</th>
                  <th className="text-left text-table-header uppercase text-muted-foreground pb-2">Customer</th>
                  <th className="text-right text-table-header uppercase text-muted-foreground pb-2">Amount</th>
                  <th className="text-center text-table-header uppercase text-muted-foreground pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-row-hover transition-colors">
                    <td className="py-2.5 text-table-body font-medium text-secondary">{o.id}</td>
                    <td className="py-2.5 text-table-body text-card-foreground">{o.customer}</td>
                    <td className="py-2.5 text-table-body text-right text-card-foreground">{formatCurrency(o.amount)}</td>
                    <td className="py-2.5 text-center"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile card list */}
          <div className="md:hidden space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="bg-card rounded-lg p-3 flex justify-between items-start border border-border">
                <div>
                  <p className="font-semibold text-sm text-secondary">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.customer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(o.amount)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <a href="/orders" className="text-sm text-secondary hover:underline">View all orders →</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
