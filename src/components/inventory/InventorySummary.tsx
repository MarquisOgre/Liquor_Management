
import { InventoryItem } from "@/types/inventory";

interface InventorySummaryProps {
  inventory: InventoryItem[];
}

export const InventorySummary = ({ inventory }: InventorySummaryProps) => {
  return (
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
  );
};
