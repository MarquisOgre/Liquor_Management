
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Home, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";

interface AnalyticsData {
  totalPurchases: number;
  totalSales: number;
  totalExpenses: number;
  profitLoss: number;
  currentStock: any[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalPurchases: 0,
    totalSales: 0,
    totalExpenses: 0,
    profitLoss: 0,
    currentStock: []
  });
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

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      
      // Fetch total purchases
      let purchaseQuery = supabase
        .from('purchase_invoices')
        .select('total_amount');
      
      if (startDate) {
        purchaseQuery = purchaseQuery.gte('order_date', format(startDate, 'yyyy-MM-dd'));
      }
      if (endDate && dateFilter === "custom") {
        purchaseQuery = purchaseQuery.lte('order_date', format(endDate, 'yyyy-MM-dd'));
      }

      const { data: purchases, error: purchaseError } = await purchaseQuery;
      if (purchaseError) throw purchaseError;

      // Fetch total expenses
      let expenseQuery = supabase
        .from('expenses')
        .select('amount');
      
      if (startDate) {
        expenseQuery = expenseQuery.gte('expense_date', format(startDate, 'yyyy-MM-dd'));
      }
      if (endDate && dateFilter === "custom") {
        expenseQuery = expenseQuery.lte('expense_date', format(endDate, 'yyyy-MM-dd'));
      }

      const { data: expenses, error: expenseError } = await expenseQuery;
      if (expenseError) throw expenseError;

      // Fetch inventory for sales calculation
      let inventoryQuery = supabase
        .from('inventory')
        .select('*');
      
      if (startDate) {
        inventoryQuery = inventoryQuery.gte('date', format(startDate, 'yyyy-MM-dd'));
      }
      if (endDate && dateFilter === "custom") {
        inventoryQuery = inventoryQuery.lte('date', format(endDate, 'yyyy-MM-dd'));
      }

      const { data: inventory, error: inventoryError } = await inventoryQuery;
      if (inventoryError) throw inventoryError;

      // Get current stock (latest inventory data)
      const { data: currentStock, error: stockError } = await supabase
        .from('inventory')
        .select('*')
        .order('date', { ascending: false });
      
      if (stockError) throw stockError;

      // Calculate totals
      const totalPurchases = purchases?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const totalSales = inventory?.reduce((sum, i) => sum + (i.sales || 0), 0) || 0;
      const profitLoss = totalSales - totalPurchases - totalExpenses;

      // Get unique current stock by brand and size (latest entries)
      const stockMap = new Map();
      currentStock?.forEach(item => {
        const key = `${item.brand}-${item.size}`;
        if (!stockMap.has(key) || new Date(item.date) > new Date(stockMap.get(key).date)) {
          stockMap.set(key, item);
        }
      });

      setAnalyticsData({
        totalPurchases,
        totalSales,
        totalExpenses,
        profitLoss,
        currentStock: Array.from(stockMap.values())
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateFilter, customStartDate, customEndDate]);

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
              <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Date Range Filter</CardTitle>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analyticsData.totalPurchases.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analyticsData.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analyticsData.totalExpenses.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit & Loss</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${analyticsData.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{analyticsData.profitLoss.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Stock Report */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Report</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Opening Balance</TableHead>
                    <TableHead>Purchase</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Closing Stock</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.currentStock.map((item) => (
                    <TableRow key={`${item.brand}-${item.size}`}>
                      <TableCell className="font-medium">{item.brand}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.opening_balance || 0}</TableCell>
                      <TableCell>{item.purchase || 0}</TableCell>
                      <TableCell>{item.sales || 0}</TableCell>
                      <TableCell>{item.closing_stock || 0}</TableCell>
                      <TableCell>{format(new Date(item.date), "PPP")}</TableCell>
                    </TableRow>
                  ))}
                  {analyticsData.currentStock.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No stock data available.
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

export default Analytics;
