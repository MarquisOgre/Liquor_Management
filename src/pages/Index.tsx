
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, BarChart3, Tags } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Liquor Inventory Management
          </h1>
          <p className="text-lg text-amber-700 mb-4">
            Streamline your liquor inventory with precision and ease
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
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
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-xl mx-auto border border-amber-200">
            <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Automatic Sales Calculation
            </h3>
            <p className="text-gray-600 text-sm">
              Sales = Opening Balance + Purchase - Closing Stock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
