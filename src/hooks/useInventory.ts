
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem, brands, bottleSizes } from "@/types/inventory";
import { inventoryService, InventoryRecord } from "@/services/inventoryService";

export const useInventory = (selectedDate: Date) => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("useInventory hook called", { inventoryLength: inventory.length });

  // Check if opening stock should be editable (only on 1st of month)
  const isOpeningStockEditable = () => {
    return selectedDate.getDate() === 1;
  };

  // Convert InventoryRecord to InventoryItem
  const recordToItem = (record: InventoryRecord): InventoryItem => ({
    brand: record.brand,
    size: record.size,
    openingBalance: Number(record.opening_balance),
    purchase: Number(record.purchase),
    closingStock: Number(record.closing_stock),
    sales: Number(record.sales)
  });

  // Convert InventoryItem to InventoryRecord
  const itemToRecord = (item: InventoryItem, date: Date): InventoryRecord => ({
    date: format(date, 'yyyy-MM-dd'),
    brand: item.brand,
    size: item.size,
    opening_balance: item.openingBalance,
    purchase: item.purchase,
    closing_stock: item.closingStock,
    sales: item.sales
  });

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

  const saveInventory = async () => {
    try {
      setIsLoading(true);
      const records = inventory.map(item => itemToRecord(item, selectedDate));
      await inventoryService.saveAllInventory(records);
      
      toast({
        title: "Inventory Saved",
        description: `Inventory data saved to Supabase for ${format(selectedDate, 'PPP')}`,
      });
    } catch (error) {
      console.error("Error saving inventory:", error);
      toast({
        title: "Error",
        description: "Failed to save inventory data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      console.log("Loading inventory for date:", format(selectedDate, 'yyyy-MM-dd'));
      
      const records = await inventoryService.getInventoryByDate(selectedDate);
      
      if (records.length > 0) {
        console.log("Loaded saved data:", records.length, "items");
        // Create a map for quick lookup
        const recordMap = new Map<string, InventoryRecord>();
        records.forEach(record => {
          recordMap.set(`${record.brand}-${record.size}`, record);
        });
        
        // Initialize inventory with all brand-size combinations
        const loadedInventory: InventoryItem[] = [];
        brands.forEach(brand => {
          bottleSizes.forEach(size => {
            const key = `${brand}-${size}`;
            const record = recordMap.get(key);
            if (record) {
              loadedInventory.push(recordToItem(record));
            } else {
              loadedInventory.push({
                brand,
                size,
                openingBalance: 0,
                purchase: 0,
                closingStock: 0,
                sales: 0
              });
            }
          });
        });
        
        setInventory(loadedInventory);
        toast({
          title: "Inventory Loaded",
          description: `Inventory data loaded from Supabase for ${format(selectedDate, 'PPP')}`,
        });
      } else {
        console.log("No saved data found, checking previous day");
        // Load previous day's closing stock as opening balance
        const previousDate = new Date(selectedDate);
        previousDate.setDate(previousDate.getDate() - 1);
        
        const previousRecords = await inventoryService.getInventoryByDate(previousDate);
        
        const newInventory: InventoryItem[] = [];
        brands.forEach(brand => {
          bottleSizes.forEach(size => {
            const previousRecord = previousRecords.find(r => r.brand === brand && r.size === size);
            newInventory.push({
              brand,
              size,
              openingBalance: previousRecord ? Number(previousRecord.closing_stock) : 0,
              purchase: 0,
              closingStock: 0,
              sales: 0
            });
          });
        });
        
        setInventory(newInventory);
        
        if (previousRecords.length > 0) {
          toast({
            title: "Previous Day's Closing Stock Loaded",
            description: "Yesterday's closing stock has been set as today's opening balance",
          });
        }
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
      // Fallback to initialize empty inventory
      initializeInventory();
    } finally {
      setIsLoading(false);
    }
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

  return {
    inventory,
    isLoading,
    updateInventoryItem,
    saveInventory,
    loadInventory,
    initializeInventory,
    isOpeningStockEditable
  };
};
