
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Tags, Users, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
      {user && <Navigation />}
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Liquor Inventory Management
          </h1>
          <p className="text-lg text-amber-700">
            Streamline your liquor inventory with precision and ease
          </p>
        </div>

        {!user ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-amber-800 mb-6">
                Please login to access the inventory management system
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 text-lg"
              >
                Login / Sign Up
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
              <div 
                onClick={() => navigate("/inventory")}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-amber-200 hover:border-amber-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <Package className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  Inventory Management
                </h2>
                <p className="text-gray-600 text-center mb-4 text-sm">
                  Track opening balance, purchases, closing stock, and calculate sales automatically
                </p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2">
                  Manage Inventory
                </Button>
              </div>

              <div 
                onClick={() => navigate("/brands")}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-purple-200 hover:border-purple-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <Tags className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  Brand & Price Management
                </h2>
                <p className="text-gray-600 text-center mb-4 text-sm">
                  Manage brands, purchasing prices, and selling prices
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2">
                  Manage Brands & Prices
                </Button>
              </div>

              <div 
                onClick={() => navigate("/vendors")}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-blue-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  Vendor Management
                </h2>
                <p className="text-gray-600 text-center mb-4 text-sm">
                  Manage vendor details, contact information, and payment terms
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2">
                  Manage Vendors
                </Button>
              </div>

              <div 
                onClick={() => navigate("/purchase-order")}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-green-200 hover:border-green-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <ShoppingCart className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  Purchase Orders
                </h2>
                <p className="text-gray-600 text-center mb-4 text-sm">
                  Create purchase orders and automatically update inventory
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2">
                  Create Purchase Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
