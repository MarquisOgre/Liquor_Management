
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [isLoading, setIsLoading] = useState(true);

  console.log("Inventory component rendered", { inventoryLength: inventory.length });

  // Check if opening stock should be editable (only on 1st of month)
  const isOpeningStockEditable = () => {
    return selectedDate.getDate() === 1;
  };

  // Initialize inventory data
  const initializeInventory = () => {
    console.log("Initializing inventory data");
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
    console.log("Initialized inventory items:", initialInventory.length);
    setInventory(initialInventory);
    setIsLoading(false);
  };

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
    console.log("Loading inventory for date:", format(selectedDate, 'yyyy-MM-dd'));
    const savedData = localStorage.getItem(`inventory_${format(selectedDate, 'yyyy-MM-dd')}`);
    if (savedData) {
      const loadedData = JSON.parse(savedData);
      console.log("Loaded saved data:", loadedData.length, "items");
      setInventory(loadedData);
      toast({
        title: "Inventory Loaded",
        description: `Inventory data loaded for ${format(selectedDate, 'PPP')}`,
      });
    } else {
      console.log("No saved data found, checking previous day");
      // Reset inventory and load previous day's closing stock as opening balance
      const previousDate = new Date(selectedDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const previousData = localStorage.getItem(`inventory_${format(previousDate, 'yyyy-MM-dd')}`);
      
      if (inventory.length === 0) {
        console.log("Inventory not initialized, initializing now");
        initializeInventory();
        return;
      }

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
    setIsLoading(false);
  };

  // Initialize inventory on component mount
  useEffect(() => {
    console.log("Component mounted, initializing inventory");
    initializeInventory();
  }, []);

  // Load inventory when date changes
  useEffect(() => {
    if (inventory.length > 0) {
      loadInventory();
    }
  }, [selectedDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading inventory...</div>
      </div>
    );
  }

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

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Debug: Inventory items loaded: {inventory.length} | Brands: {brands.length} | Sizes: {bottleSizes.length}
          </p>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            {inventory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No inventory data available. Initializing...</p>
                <Button onClick={initializeInventory} className="mt-4">
                  Initialize Inventory
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50">Brand</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-gray-50">Size</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-blue-50">Opening Balance</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-green-50">Purchase</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-orange-50">Closing Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 bg-purple-50">Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item, index) => (
                    <TableRow key={`${item.brand}-${item.size}`} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-800 bg-gray-50">{item.brand}</TableCell>
                      <TableCell className="text-gray-600 bg-gray-50">{item.size}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.openingBalance}
                          onChange={(e) => updateInventoryItem(index, 'openingBalance', e.target.value)}
                          className="w-24 h-8 text-center border-blue-200 focus:border-blue-400"
                          min="0"
                          step="0.01"
                          disabled={!isOpeningStockEditable()}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-24 h-8 flex items-center justify-center bg-gray-100 rounded border text-gray-700 font-semibold">
                          {item.purchase.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.closingStock}
                          onChange={(e) => updateInventoryItem(index, 'closingStock', e.target.value)}
                          className="w-24 h-8 text-center border-orange-200 focus:border-orange-400"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-24 h-8 flex items-center justify-center bg-purple-50 rounded border text-purple-700 font-semibold">
                          {item.sales.toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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
