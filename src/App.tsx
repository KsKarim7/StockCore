import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import OrdersList from "./pages/OrdersList";
import SalesReturnsList from "./pages/SalesReturnsList";
import PurchasesList from "./pages/PurchasesList";
import PurchaseReturnsList from "./pages/PurchaseReturnsList";
import ExpensesList from "./pages/ExpensesList";
import StockMovementLog from "./pages/StockMovementLog";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/sales-returns" element={<SalesReturnsList />} />
          <Route path="/purchases" element={<PurchasesList />} />
          <Route path="/purchase-returns" element={<PurchaseReturnsList />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/stock-log" element={<StockMovementLog />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
