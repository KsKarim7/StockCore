import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Calendar } from "lucide-react";

const reports = [
  { name: "Sales Report", desc: "Complete breakdown of all sales with customer details and payment status.", lastRun: "Yesterday" },
  { name: "Purchase Report", desc: "Summary of all purchases including supplier payments and outstanding dues.", lastRun: "3 days ago" },
  { name: "Sales Returns Report", desc: "All returned items with reason codes and refund amounts.", lastRun: "1 week ago" },
  { name: "Purchase Returns Report", desc: "Items returned to suppliers with adjustment details.", lastRun: "2 weeks ago" },
  { name: "Expenses Report", desc: "Monthly expense breakdown by category and party.", lastRun: "Yesterday" },
  { name: "Stock Movement Report", desc: "Full audit trail of all inventory changes.", lastRun: "Today" },
];

export default function Reports() {
  return (
    <PageLayout title="Reports & Exports" searchPlaceholder="Search reports...">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {reports.map((r) => (
          <div key={r.name} className="bg-card rounded-lg p-4 md:p-5 shadow-sm border border-border">
            <h3 className="text-sm md:text-base font-semibold text-card-foreground mb-1">{r.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 md:mb-4">{r.desc}</p>
            <div className="flex items-center justify-between mb-3 md:mb-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Last run: {r.lastRun}</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 md:justify-end">
              <Button variant="outline" size="sm" className="w-full md:w-auto"><FileText className="h-4 w-4 mr-1" /> PDF</Button>
              <Button variant="outline" size="sm" className="w-full md:w-auto"><FileSpreadsheet className="h-4 w-4 mr-1" /> Excel</Button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
