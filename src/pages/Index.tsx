
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, BarChart3, Tags } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">
            Liquor Inventory Management
          </h1>
          <p className="text-xl text-amber-700 mb-8">
            Streamline your liquor inventory with precision and ease
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div 
            onClick={() => navigate("/inventory")}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-amber-200 hover:border-amber-300"
          >
            <div className="flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Inventory Management
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Track opening balance, purchases, closing stock, and calculate sales automatically
            </p>
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3">
              Manage Inventory
            </Button>
          </div>

          <div 
            onClick={() => navigate("/prices")}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-emerald-200 hover:border-emerald-300"
          >
            <div className="flex items-center justify-center mb-6">
              <DollarSign className="w-16 h-16 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Price Management
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Set and manage prices for each brand and bottle size
            </p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">
              Manage Prices
            </Button>
          </div>

          <div 
            onClick={() => navigate("/brands")}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-purple-200 hover:border-purple-300"
          >
            <div className="flex items-center justify-center mb-6">
              <Tags className="w-16 h-16 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Brand Management
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Add, edit, and manage your liquor brands
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
              Manage Brands
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto border border-amber-200">
            <BarChart3 className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Automatic Sales Calculation
            </h3>
            <p className="text-gray-600">
              Sales = Opening Balance + Purchase - Closing Stock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
