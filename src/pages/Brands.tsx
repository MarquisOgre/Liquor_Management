
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Save, Plus, Trash2, Edit2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const bottleSizes = ["720ML", "360ML", "180ML", "90ML"];

interface Brand {
  id: string;
  name: string;
}

interface PriceItem {
  brand: string;
  size: string;
  purchasingPrice: number;
  sellingPrice: number;
}

const Brands = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadBrands();
    loadPrices();
  }, []);

  // Update prices when brands change
  useEffect(() => {
    updatePricesForBrands();
  }, [brands]);

  const loadBrands = () => {
    const savedBrands = localStorage.getItem('liquor_brands');
    if (savedBrands) {
      setBrands(JSON.parse(savedBrands));
    } else {
      // Initialize with default brands
      const defaultBrands = [
        "IB", "Royal Stag", "MM Vodka", "Iconiq White", "MM Orange",
        "After Dark", "Mc Dowel", "Royal Challenge", "Mountain Oak",
        "8PMM", "Green Level", "Romano"
      ].map((name, index) => ({ id: `brand_${index}`, name }));
      setBrands(defaultBrands);
      localStorage.setItem('liquor_brands', JSON.stringify(defaultBrands));
    }
  };

  const loadPrices = () => {
    const savedPrices = localStorage.getItem('liquor_prices');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  };

  const updatePricesForBrands = () => {
    const brandNames = brands.map(b => b.name);
    const newPrices: PriceItem[] = [];
    
    brandNames.forEach(brand => {
      bottleSizes.forEach(size => {
        const existingPrice = prices.find(p => p.brand === brand && p.size === size);
        newPrices.push({
          brand,
          size,
          purchasingPrice: existingPrice?.purchasingPrice || 0,
          sellingPrice: existingPrice?.sellingPrice || 0
        });
      });
    });
    
    setPrices(newPrices);
  };

  const saveBrands = () => {
    localStorage.setItem('liquor_brands', JSON.stringify(brands));
    toast({
      title: "Brands Saved",
      description: "All brand data has been saved successfully",
    });
  };

  const savePrices = () => {
    localStorage.setItem('liquor_prices', JSON.stringify(prices));
    toast({
      title: "Prices Saved",
      description: "All price data has been saved successfully",
    });
  };

  const saveAll = () => {
    saveBrands();
    savePrices();
    toast({
      title: "All Data Saved",
      description: "Brands and prices have been saved successfully",
    });
  };

  const addBrand = () => {
    if (newBrandName.trim()) {
      const newBrand: Brand = {
        id: `brand_${Date.now()}`,
        name: newBrandName.trim()
      };
      setBrands([...brands, newBrand]);
      setNewBrandName("");
      toast({
        title: "Brand Added",
        description: `${newBrand.name} has been added successfully`,
      });
    }
  };

  const deleteBrand = (id: string) => {
    const brandToDelete = brands.find(b => b.id === id);
    setBrands(brands.filter(brand => brand.id !== id));
    toast({
      title: "Brand Deleted",
      description: `${brandToDelete?.name} has been removed`,
    });
  };

  const startEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setEditingName(brand.name);
  };

  const saveEdit = () => {
    if (editingName.trim()) {
      setBrands(brands.map(brand => 
        brand.id === editingId 
          ? { ...brand, name: editingName.trim() }
          : brand
      ));
      setEditingId(null);
      setEditingName("");
      toast({
        title: "Brand Updated",
        description: "Brand name has been updated successfully",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const updatePrice = (index: number, field: 'purchasingPrice' | 'sellingPrice', value: string) => {
    const newPrices = [...prices];
    newPrices[index][field] = parseFloat(value) || 0;
    setPrices(newPrices);
  };

  const resetPrices = () => {
    const resetPrices = prices.map(item => ({ 
      ...item, 
      purchasingPrice: 0, 
      sellingPrice: 0 
    }));
    setPrices(resetPrices);
    toast({
      title: "Prices Reset",
      description: "All prices have been reset to 0",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
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
              <h1 className="text-3xl font-bold text-gray-800">Brand & Price Management</h1>
            </div>
            
            <Button onClick={saveAll} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="brands" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="brands">Brand Management</TabsTrigger>
            <TabsTrigger value="prices">Price Management</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-6">
            {/* Add New Brand */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Brand</h2>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter brand name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addBrand()}
                />
                <Button onClick={addBrand} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Brand
                </Button>
              </div>
            </div>

            {/* Brands List */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Current Brands ({brands.length})</h2>
              </div>
              
              <div className="divide-y">
                {brands.map((brand) => (
                  <div key={brand.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      {editingId === brand.id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 max-w-md"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          />
                          <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                            Save
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <span className="text-lg font-medium text-gray-800">{brand.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => startEdit(brand)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteBrand(brand.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {brands.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">No brands added yet</p>
                  <p className="text-sm">Add your first brand using the form above</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            {/* Price Management Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Price Management</h2>
                <div className="flex items-center gap-4">
                  <Button onClick={loadPrices} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Load
                  </Button>
                  <Button onClick={resetPrices} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                    Reset All
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
                      <th className="px-4 py-4 text-left font-semibold text-gray-700 border-r">Brand</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700 border-r">Size</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700 border-r bg-blue-50">Purchasing Price (₹)</th>
                      <th className="px-4 py-4 text-left font-semibold text-gray-700 bg-green-50">Selling Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((item, index) => (
                      <tr key={`${item.brand}-${item.size}`} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800 border-r bg-gray-50">{item.brand}</td>
                        <td className="px-4 py-3 text-gray-600 border-r bg-gray-50">{item.size}</td>
                        <td className="px-4 py-3 border-r">
                          <Input
                            type="number"
                            value={item.purchasingPrice}
                            onChange={(e) => updatePrice(index, 'purchasingPrice', e.target.value)}
                            className="w-28 h-8 text-center border-blue-200 focus:border-blue-400"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            value={item.sellingPrice}
                            onChange={(e) => updatePrice(index, 'sellingPrice', e.target.value)}
                            className="w-28 h-8 text-center border-green-200 focus:border-green-400"
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

            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Price Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {bottleSizes.map(size => (
                  <div key={size} className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">{size} Bottles</p>
                    <p className="text-lg font-bold text-purple-800">
                      {prices.filter(p => p.size === size && (p.purchasingPrice > 0 || p.sellingPrice > 0)).length} priced
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Price Management Tips:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Set purchasing and selling prices for each brand and bottle size combination</li>
                <li>• Prices are automatically saved to local storage</li>
                <li>• Use the Load button to refresh data from storage</li>
                <li>• Reset All will clear all prices back to 0</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Brands;
