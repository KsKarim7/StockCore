import { useState, useMemo } from "react";
import { AxiosError } from "axios";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ShoppingCart, DollarSign, AlertCircle, Plus, FileText, FileSpreadsheet, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, type Order } from "@/api/ordersApi";
import { getProducts as fetchProducts } from "@/api/productsApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { StatusType } from "@/components/shared/StatusBadge";

const paisaToTaka = (paisa: number) => {
  return paisa / 100;
};

// Helper to safely convert backend paisa values which are already in taka string format
const toPriceNumber = (value: string | number): number => {
  if (typeof value === 'string') {
    return parseFloat(value);
  }
  // Backward compatibility: if it's a number, assume it's actually paisa and convert
  return paisaToTaka(value);
};

// Convert Order status to StatusBadge StatusType
const orderStatusToStatusType = (status: string): StatusType => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "partially paid") return "partial";
  if (lowerStatus === "confirmed") return "confirmed";
  if (lowerStatus === "paid") return "paid";
  if (lowerStatus === "cancelled") return "cancelled";
  if (lowerStatus === "returned") return "returned";
  return "confirmed";
};

interface OrderLineItem {
  product_id: string;
  product_code: string;
  product_name: string;
  qty: number;
  unit_price_paisa: number;
  vat_percent: number;
}

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create Order form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([]);

  // Fetch orders
  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ["orders", page, statusFilter],
    queryFn: () =>
      getOrders({
        page,
        limit: 10,
        status: statusFilter || undefined,
      }),
  });

  // Fetch products for order creation
  const { data: productsData } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () =>
      fetchProducts({
        limit: 100,
      }),
  });

  const orders = ordersData?.orders ?? [];
  const products = productsData?.products ?? [];
  const pagination = ordersData?.pagination;
  const totalOrders = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  // Calculate stats
  // NOTE: Backend converts paisa to taka strings, so these fields named "*_paisa" actually contain taka values
  // Use toPriceNumber helper which handles both string and number formats
  const totalReceived = orders.reduce((sum, o) => sum + toPriceNumber(o.amount_received_paisa), 0);
  const totalDue = orders.reduce((sum, o) => sum + toPriceNumber(o.amount_due_paisa), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + toPriceNumber(o.total_paisa), 0);

  // Filter by search term locally
  const filteredOrders = orders.filter(o =>
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create Order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!customerName || !customerPhone) {
        throw new Error("Customer name and phone are required");
      }
      if (lineItems.length === 0) {
        throw new Error("Add at least one product to the order");
      }

      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        lines: lineItems.map(item => ({
          product_id: item.product_id,
          qty: item.qty,
          unit_price: paisaToTaka(item.unit_price_paisa).toFixed(2),
          vat_percent: item.vat_percent,
        })),
      };

      return createOrder(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsCreateSheetOpen(false);
      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setSelectedProduct("");
      setQuantity(1);
      setLineItems([]);
      toast({
        title: "Order created successfully",
      });
    },
    onError: (error: AxiosError) => {
      let description = error.message || "Something went wrong";

      // Check if it's an insufficient stock error
      if (error.response?.status === 409) {
        const errorData = error.response?.data?.data;
        if (errorData) {
          description = `Insufficient stock for: ${errorData.product_name}. Available: ${errorData.available} units`;
        } else {
          description = error.response?.data?.message || "Insufficient stock";
        }
      }

      toast({
        title: "Failed to create order",
        description: description,
        variant: "destructive",
      });
    },
  });

  const handleAddLineItem = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({
        title: "Invalid product or quantity",
        variant: "destructive",
      });
      return;
    }

    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    // Check stock availability
    if (product.stock_qty < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock_qty} units available for ${product.name}`,
        variant: "destructive",
      });
      return;
    }

    const unitPriceTaka = parseFloat(product.selling_price_taka);
    const unitPricePaisa = Math.round(unitPriceTaka * 100);

    setLineItems([
      ...lineItems,
      {
        product_id: product._id,
        product_code: product.product_code,
        product_name: product.name,
        qty: quantity,
        unit_price_paisa: unitPricePaisa,
        vat_percent: product.vat_enabled ? (product.vat_percent || 0) : 0,
      },
    ]);

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Export orders as CSV
  const handleExportCSV = () => {
    const headers = ["Order No", "Date", "Customer", "Total", "Received", "Due", "Status"];
    const rows = filteredOrders.map(o => [
      o.order_number,
      new Date(o.createdAt).toLocaleDateString(),
      o.customer.name,
      toPriceNumber(o.total_paisa).toFixed(2),
      toPriceNumber(o.amount_received_paisa).toFixed(2),
      toPriceNumber(o.amount_due_paisa).toFixed(2),
      o.status,
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Orders exported",
      description: `Exported ${filteredOrders.length} orders as CSV`,
    });
  };

  // Export orders as Excel (simple JSON to Excel conversion)
  const handleExportExcel = async () => {
    try {
      const data = filteredOrders.map(o => ({
        "Order No": o.order_number,
        "Date": new Date(o.createdAt).toLocaleDateString(),
        "Customer": o.customer.name,
        "Items": o.lines.length,
        "Total (Taka)": toPriceNumber(o.total_paisa).toFixed(2),
        "Received (Taka)": toPriceNumber(o.amount_received_paisa).toFixed(2),
        "Due (Taka)": toPriceNumber(o.amount_due_paisa).toFixed(2),
        "Status": o.status,
      }));

      // Convert to CSV format (Excel will open CSV files)
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(","),
        ...data.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Orders exported",
        description: `Exported ${filteredOrders.length} orders as Excel`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        variant: "destructive",
      });
    }
  };

  if (isError) {
    return (
      <PageLayout title="Orders & Sales" searchPlaceholder="Search by order no or customer...">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          Error loading orders: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Orders & Sales"
      searchPlaceholder="Search by order no or customer..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <StatCard
          label="Total Orders"
          value={String(totalOrders)}
          trend={{ value: "This month", positive: true }}
          icon={ShoppingCart}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend={{ value: `${orders.length} orders`, positive: true }}
          icon={DollarSign}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          label="Pending Due"
          value={formatCurrency(totalDue)}
          subtitle={`${orders.filter(o => o.amount_due_paisa > 0).length} orders`}
          icon={AlertCircle}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={filteredOrders.length === 0}>
            <FileText className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={filteredOrders.length === 0}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel
          </Button>
        </div>
        <Button
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsCreateSheetOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Create Order
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant={statusFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All
        </Button>
        {["Confirmed", "Partially Paid", "Paid", "Cancelled"].map(status => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Order No", "Date & Time", "Customer", "Items", "Total", "Received", "Due", "Status"].map(h => (
                  <th key={h} className="text-left text-table-header uppercase text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o, i) => (
                  <tr key={o._id} className={`border-b border-border last:border-0 hover:bg-row-hover transition-colors ${i % 2 === 1 ? 'bg-muted/20' : ''}`}>
                    <td className="px-4 py-3 text-table-body font-medium text-secondary">{o.order_number}</td>
                    <td className="px-4 py-3 text-table-body text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-table-body text-card-foreground">{o.customer.name}</td>
                    <td className="px-4 py-3 text-table-body text-muted-foreground">{o.lines.length}</td>
                    <td className="px-4 py-3 text-table-body font-medium">{formatCurrency(toPriceNumber(o.total_paisa))}</td>
                    <td className="px-4 py-3 text-table-body text-success">{formatCurrency(toPriceNumber(o.amount_received_paisa))}</td>
                    <td className="px-4 py-3 text-table-body text-destructive font-medium">
                      {toPriceNumber(o.amount_due_paisa) > 0 ? formatCurrency(toPriceNumber(o.amount_due_paisa)) : "—"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={orderStatusToStatusType(o.status)} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No orders found</div>
        ) : (
          filteredOrders.map((o) => (
            <div key={o._id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-secondary">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">{o.customer.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{formatCurrency(toPriceNumber(o.total_paisa))}</p>
                  {toPriceNumber(o.amount_due_paisa) > 0 && <p className="text-xs text-destructive font-medium">Due: {formatCurrency(toPriceNumber(o.amount_due_paisa))}</p>}
                </div>
                <StatusBadge status={orderStatusToStatusType(o.status)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Order Sheet */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent side="right" className="w-full md:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Order</SheetTitle>
            <SheetDescription>Add customer information and select products</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Customer Information */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name *</label>
              <Input
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Phone *</label>
              <Input
                placeholder="Enter phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            {/* Add Products */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Add Products</h3>

              <div className="space-y-2 mb-3">
                <label className="text-sm font-medium">Select Product</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name} ({p.product_code}) - {formatCurrency(parseFloat(p.selling_price_taka))} {p.stock_qty > 0 ? `[${p.stock_qty} in stock]` : '[Out of stock]'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="flex items-end">
                  <Button size="sm" onClick={handleAddLineItem}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Line Items */}
              {lineItems.length > 0 && (
                <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium">Order Items</h4>
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.qty} x {formatCurrency(paisaToTaka(item.unit_price_paisa))} = {formatCurrency(paisaToTaka(item.qty * item.unit_price_paisa))}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLineItem(idx)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createOrderMutation.mutate()}
              disabled={createOrderMutation.isPending || lineItems.length === 0}
            >
              {createOrderMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
