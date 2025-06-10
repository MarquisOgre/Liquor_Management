
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Home, Plus } from "lucide-react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface PurchaseInvoice {
  id: string;
  invoice_number: string;
  vendor_name: string;
  order_date: string;
  expected_delivery_date: string | null;
  status: string;
  total_amount: number | null;
  notes: string | null;
  created_at: string;
}

const PurchaseInvoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date = now;

    switch (dateFilter) {
      case "7days":
        startDate = subDays(now, 7);
        break;
      case "1month":
        startDate = subMonths(now, 1);
        break;
      case "3months":
        startDate = subMonths(now, 3);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        break;
      case "1year":
        startDate = subYears(now, 1);
        break;
      case "custom":
        startDate = customStartDate || null;
        endDate = customEndDate || now;
        break;
      default:
        startDate = null;
    }

    return { startDate, endDate };
  };

  const fetchPurchaseInvoices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('purchase_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      const { startDate, endDate } = getDateRange();
      
      if (startDate) {
        query = query.gte('order_date', format(startDate, 'yyyy-MM-dd'));
      }
      if (endDate && dateFilter === "custom") {
        query = query.lte('order_date', format(endDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPurchaseInvoices(data || []);
    } catch (error) {
      console.error('Error fetching purchase invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseInvoices();
  }, [dateFilter, customStartDate, customEndDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Purchase Invoices</h1>
            </div>
            
            <Button 
              onClick={() => navigate("/purchase-invoice")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Purchase Invoice
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="1month">Last 1 Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last 1 Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateFilter === "custom" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-48 justify-start text-left font-normal",
                            !customStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customStartDate ? format(customStartDate, "PPP") : <span>Pick start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={customStartDate}
                          onSelect={setCustomStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-48 justify-start text-left font-normal",
                            !customEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customEndDate ? format(customEndDate, "PPP") : <span>Pick end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={customEndDate}
                          onSelect={setCustomEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Invoices List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.vendor_name}</TableCell>
                      <TableCell>{format(new Date(invoice.order_date), "PPP")}</TableCell>
                      <TableCell>
                        {invoice.expected_delivery_date 
                          ? format(new Date(invoice.expected_delivery_date), "PPP")
                          : "Not set"
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {invoice.total_amount ? `₹${invoice.total_amount.toLocaleString()}` : "₹0"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {invoice.notes || "No notes"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {purchaseInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No purchase invoices found for the selected date range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseInvoices;
