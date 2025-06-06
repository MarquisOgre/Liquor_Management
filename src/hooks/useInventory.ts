
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem, brands, bottleSizes } from "@/types/inventory";

export const useInventory = (selectedDate: Date) => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("useInventory hook called", { inventoryLength: inventory.length });

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
