
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Save, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const brands = [
  "IB", "Royal Stag", "MM Vodka", "Iconiq White", "MM Orange",
  "After Dark", "Mc Dowel", "Royal Challenge", "Mountain Oak",
  "8PMM", "Green Level", "Romano"
];

const bottleSizes = ["720ML", "360ML", "180ML", "90ML"];

interface PriceItem {
  brand: string;
  size: string;
  price: number;
}

const Prices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prices, setPrices] = useState<PriceItem[]>([]);

  // Initialize price data
  useEffect(() => {
    const initialPrices: PriceItem[] = [];
    brands.forEach(brand => {
      bottleSizes.forEach(size => {
        initialPrices.push({
          brand,
          size,
          price: 0
        });
      });
    });
    setPrices(initialPrices);
    loadPrices();
  }, []);

  const updatePriceItem = (index: number, value: string) => {
    const newPrices = [...prices];
    newPrices[index].price = parseFloat(value) || 0;
    setPrices(newPrices);
  };

  const savePrices = () => {
    localStorage.setItem('liquor_prices', JSON.stringify(prices));
    toast({
      title: "Prices Saved",
      description: "All price data has been saved successfully",
    });
  };

  const loadPrices = () => {
    const savedPrices = localStorage.getItem('liquor_prices');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  };

  const resetPrices = () => {
    const resetPrices = prices.map(item => ({ ...item, price: 0 }));
    setPrices(resetPrices);
    toast({
      title: "Prices Reset",
      description: "All prices have been reset to 0",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
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
              <h1 className="text-3xl font-bold text-gray-800">Price Management</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={loadPrices} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Load
              </Button>
              
              <Button onClick={resetPrices} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                Reset All
              </Button>
              
              <Button onClick={savePrices} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" />
                Save Prices
              </Button>
            </div>
          </div>
        </div>

        {/* Prices Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-r">Brand</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 border-r">Size</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 bg-emerald-50">Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((item, index) => (
                  <tr key={`${item.brand}-${item.size}`} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800 border-r bg-gray-50">{item.brand}</td>
                    <td className="px-6 py-4 text-gray-600 border-r bg-gray-50">{item.size}</td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updatePriceItem(index, e.target.value)}
                        className="w-32 h-8 text-center border-emerald-200 focus:border-emerald-400"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Price Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {bottleSizes.map(size => (
              <div key={size} className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-emerald-600 font-medium">{size} Bottles</p>
                <p className="text-lg font-bold text-emerald-800">
                  {prices.filter(p => p.size === size && p.price > 0).length} priced
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Price Management Tips:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Set prices for each brand and bottle size combination</li>
            <li>• Prices are automatically saved to local storage</li>
            <li>• Use the Load button to refresh data from storage</li>
            <li>• Reset All will clear all prices back to 0</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Prices;
