
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Brands from "./pages/Brands";
import Vendors from "./pages/Vendors";
import PurchaseInvoice from "./pages/PurchaseInvoice";
import PurchaseInvoices from "./pages/PurchaseInvoices";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } />
                <Route path="/brands" element={
                  <ProtectedRoute>
                    <Brands />
                  </ProtectedRoute>
                } />
                <Route path="/vendors" element={
                  <ProtectedRoute>
                    <Vendors />
                  </ProtectedRoute>
                } />
                <Route path="/purchase-invoice" element={
                  <ProtectedRoute>
                    <PurchaseInvoice />
                  </ProtectedRoute>
                } />
                <Route path="/purchase-invoice/:id" element={
                  <ProtectedRoute>
                    <PurchaseInvoice />
                  </ProtectedRoute>
                } />
                <Route path="/purchase-invoices" element={
                  <ProtectedRoute>
                    <PurchaseInvoices />
                  </ProtectedRoute>
                } />
                <Route path="/expenses" element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
