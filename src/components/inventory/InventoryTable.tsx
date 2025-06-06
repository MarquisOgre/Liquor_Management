
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InventoryItem, brands, bottleSizes } from "@/types/inventory";

interface InventoryTableProps {
  inventory: InventoryItem[];
  onUpdateItem: (index: number, field: string, value: string) => void;
  onInitialize: () => void;
  isOpeningStockEditable: boolean;
}

export const InventoryTable = ({ 
  inventory, 
  onUpdateItem, 
  onInitialize, 
  isOpeningStockEditable 
}: InventoryTableProps) => {
  if (inventory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-8 text-center text-gray-500">
          <p>No inventory data available. Initializing...</p>
          <Button onClick={onInitialize} className="mt-4">
            Initialize Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
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
                    onChange={(e) => onUpdateItem(index, 'openingBalance', e.target.value)}
                    className="w-24 h-8 text-center border-blue-200 focus:border-blue-400"
                    min="0"
                    step="0.01"
                    disabled={!isOpeningStockEditable}
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
                    onChange={(e) => onUpdateItem(index, 'closingStock', e.target.value)}
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
      </div>
    </div>
  );
};
