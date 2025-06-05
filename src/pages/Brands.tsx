
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Save, Plus, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: string;
  name: string;
}

const Brands = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

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

  const saveBrands = () => {
    localStorage.setItem('liquor_brands', JSON.stringify(brands));
    toast({
      title: "Brands Saved",
      description: "All brand data has been saved successfully",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
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
              <h1 className="text-3xl font-bold text-gray-800">Brand Management</h1>
            </div>
            
            <Button onClick={saveBrands} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Add New Brand */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Changes to brands will affect inventory and price management</li>
            <li>• Make sure to save your changes before navigating away</li>
            <li>• Deleting a brand will remove it from all future inventory entries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Brands;
