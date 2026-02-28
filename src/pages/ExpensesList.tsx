import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, AlertCircle, Plus, FileText, FileSpreadsheet } from "lucide-react";

const expenses = [
  { date: "26 Feb 2026", party: "BD Courier", desc: "Monthly delivery charges", total: 8500, paid: 8500, due: 0 },
  { date: "24 Feb 2026", party: "Electricity Board", desc: "Shop electricity bill - Feb", total: 4200, paid: 4200, due: 0 },
  { date: "22 Feb 2026", party: "Mirza Traders", desc: "Office supplies restock", total: 3800, paid: 2000, due: 1800 },
  { date: "18 Feb 2026", party: "Rent", desc: "Monthly shop rent", total: 25000, paid: 25000, due: 0 },
];

export default function ExpensesList() {
  return (
    <PageLayout title="Expenses" searchPlaceholder="Search expenses...">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard label="Total Expenses" value={formatCurrency(41500)} icon={Wallet} iconColor="text-primary" iconBg="bg-primary/10" />
        <StatCard label="Total Paid" value={formatCurrency(39700)} icon={DollarSign} iconColor="text-success" iconBg="bg-success/10" />
        <StatCard label="Total Due" value={formatCurrency(1800)} icon={AlertCircle} iconColor="text-warning" iconBg="bg-warning/10" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
        </div>
        <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Expense
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Date", "Party Name", "Description", "Total", "Paid", "Due", "Actions"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{e.date}</td>
                  <td className="px-4 py-3 text-table-body font-medium">{e.party}</td>
                  <td className="px-4 py-3 text-table-body text-muted-foreground">{e.desc}</td>
                  <td className="px-4 py-3 text-table-body font-medium">{formatCurrency(e.total)}</td>
                  <td className="px-4 py-3 text-table-body text-success">{formatCurrency(e.paid)}</td>
                  <td className="px-4 py-3 text-table-body text-destructive font-medium">{e.due > 0 ? formatCurrency(e.due) : "—"}</td>
                  <td className="px-4 py-3 text-table-body text-secondary hover:underline cursor-pointer">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {expenses.map((e, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-1">
              <p className="font-semibold text-sm text-card-foreground">{e.party}</p>
              <p className="text-xs text-muted-foreground">{e.date}</p>
            </div>
            <p className="text-xs text-muted-foreground truncate mb-2">{e.desc}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">{formatCurrency(e.total)}</p>
              {e.due > 0 ? (
                <p className="text-xs text-destructive font-medium">Due: {formatCurrency(e.due)}</p>
              ) : (
                <p className="text-xs text-success font-medium">Paid</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
