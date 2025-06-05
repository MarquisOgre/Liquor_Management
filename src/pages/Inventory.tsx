
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Home, Save, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const brands = [
  "IB", "Royal Stag", "MM Vodka", "Iconiq White", "MM Orange",
  "After Dark", "Mc Dowel", "Royal Challenge", "Mountain Oak",
  "8PMM", "Green Level", "Romano"
];

const bottleSizes = ["720ML", "360ML", "180ML", "90ML"];

interface InventoryItem {
  brand: string;
  size: string;
  openingBalance: number;
  purchase: number;
  closingStock: number;
  sales: number;
}

const Inventory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Initialize inventory data
  useEffect(() => {
    const initialInventory: InventoryItem[] = [];
    brands.forEach(brand => {
      bottleSizes.forEach(size => {
        initialInventory.push({
          brand,
          size,
          openingBalance: 0,
          purchase: 0,
          closingStock: 0,
          sales: 0
        });
      });
    });
    setInventory(initialInventory);
  }, []);

  // Calculate sales automatically
  const calculateSales = (openingBalance: number, purchase: number, closingStock: number) => {
    return openingBalance + purchase - closingStock;
  };

  const updateInventoryItem = (index: number, field: string, value: string) => {
    const newInventory = [...inventory];
    const numValue = parseFloat(value) || 0;
    newInventory[index] = { ...newInventory[index], [field]: numValue };
    
    // Recalculate sales
    const item = newInventory[index];
    item.sales = calculateSales(item.openingBalance, item.purchase, item.closingStock);
    
    setInventory(newInventory);
  };

  const saveInventory = () => {
    localStorage.setItem(`inventory_${format(selectedDate, 'yyyy-MM-dd')}`, JSON.stringify(inventory));
    toast({
      title: "Inventory Saved",
      description: `Inventory data saved for ${format(selectedDate, 'PPP')}`,
    });
  };

  const loadInventory = () => {
    const savedData = localStorage.getItem(`inventory_${format(selectedDate, 'yyyy-MM-dd')}`);
    if (savedData) {
      setInventory(JSON.parse(savedData));
      toast({
        title: "Inventory Loaded",
        description: `Inventory data loaded for ${format(selectedDate, 'PPP')}`,
      });
    } else {
      // Reset inventory and load previous day's closing stock as opening balance
      const previousDate = new Date(selectedDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const previousData = localStorage.getItem(`inventory_${format(previousDate, 'yyyy-MM-dd')}`);
      
      const newInventory = [...inventory];
      // First reset all fields to 0
      newInventory.forEach((item, index) => {
        newInventory[index] = {
          ...item,
          openingBalance: 0,
          purchase: 0,
          closingStock: 0,
          sales: 0
        };
      });
      
      // Then set opening balance from previous day's closing stock if available
      if (previousData) {
        const previousInventory = JSON.parse(previousData);
        previousInventory.forEach((item: InventoryItem, index: number) => {
          if (newInventory[index]) {
            newInventory[index].openingBalance = item.closingStock;
            newInventory[index].sales = calculateSales(
              newInventory[index].openingBalance,
              newInventory[index].purchase,
              newInventory[index].closingStock
            );
          }
        });
        setInventory(newInventory);
        toast({
          title: "Previous Day's Closing Stock Loaded",
          description: "Yesterday's closing stock has been set as today's opening balance",
        });
      } else {
        setInventory(newInventory);
      }
    }
  };

  useEffect(() => {
    loadInventory();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-800">Liquor Inventory</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button onClick={loadInventory} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Load
              </Button>
              
              <Button onClick={saveInventory} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r">Size</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r bg-blue-50">Opening Balance</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r bg-green-50">Purchase</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r bg-orange-50">Closing Stock</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-purple-50">Sales</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={`${item.brand}-${item.size}`} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 border-r bg-gray-50">{item.brand}</td>
                    <td className="px-4 py-3 text-gray-600 border-r bg-gray-50">{item.size}</td>
                    <td className="px-4 py-3 border-r">
                      <Input
                        type="number"
                        value={item.openingBalance}
                        onChange={(e) => updateInventoryItem(index, 'openingBalance', e.target.value)}
                        className="w-24 h-8 text-center border-blue-200 focus:border-blue-400"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3 border-r">
                      <Input
                        type="number"
                        value={item.purchase}
                        onChange={(e) => updateInventoryItem(index, 'purchase', e.target.value)}
                        className="w-24 h-8 text-center border-green-200 focus:border-green-400"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3 border-r">
                      <Input
                        type="number"
                        value={item.closingStock}
                        onChange={(e) => updateInventoryItem(index, 'closingStock', e.target.value)}
                        className="w-24 h-8 text-center border-orange-200 focus:border-orange-400"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-8 flex items-center justify-center bg-purple-50 rounded border text-purple-700 font-semibold">
                        {item.sales.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Opening</p>
              <p className="text-2xl font-bold text-blue-800">
                {inventory.reduce((sum, item) => sum + item.openingBalance, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Purchase</p>
              <p className="text-2xl font-bold text-green-800">
                {inventory.reduce((sum, item) => sum + item.purchase, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Total Closing</p>
              <p className="text-2xl font-bold text-orange-800">
                {inventory.reduce((sum, item) => sum + item.closingStock, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-purple-800">
                {inventory.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
