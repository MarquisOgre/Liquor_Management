
import { useState } from "react";
import { brands, bottleSizes } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventorySummary } from "@/components/inventory/InventorySummary";
import Navigation from "@/components/Navigation";

const Inventory = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    inventory,
    isLoading,
    updateInventoryItem,
    saveInventory,
    loadInventory,
    initializeInventory,
    isOpeningStockEditable
  } = useInventory(selectedDate);

  console.log("Inventory component rendered", { inventoryLength: inventory.length });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto p-4">
        <InventoryHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onSave={saveInventory}
          onLoad={loadInventory}
        />

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Debug: Inventory items loaded: {inventory.length} | Brands: {brands.length} | Sizes: {bottleSizes.length}
          </p>
        </div>

        <InventoryTable
          inventory={inventory}
          onUpdateItem={updateInventoryItem}
          onInitialize={initializeInventory}
          isOpeningStockEditable={isOpeningStockEditable()}
        />

        <InventorySummary inventory={inventory} />
      </div>
    </div>
  );
};

export default Inventory;
