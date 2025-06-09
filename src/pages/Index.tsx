
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, FileText, ShoppingCart, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      title: "Inventory Management",
      description: "Track your liquor inventory with opening balance, purchases, sales, and closing stock.",
      icon: Package,
      href: "/inventory",
      color: "bg-blue-500"
    },
    {
      title: "Brand Management",
      description: "Manage different liquor brands and their bottle sizes.",
      icon: TrendingUp,
      href: "/brands",
      color: "bg-green-500"
    },
    {
      title: "Vendor Management",
      description: "Manage your vendors and supplier information.",
      icon: Users,
      href: "/vendors",
      color: "bg-purple-500"
    },
    {
      title: "Purchase Orders",
      description: "Create and manage purchase orders with your vendors.",
      icon: FileText,
      href: "/purchase-order",
      color: "bg-orange-500"
    },
    {
      title: "View Purchase Orders",
      description: "View and filter all purchase orders by date ranges.",
      icon: ShoppingCart,
      href: "/purchase-orders",
      color: "bg-teal-500"
    },
    {
      title: "Reports & Analytics",
      description: "Generate reports and analyze your inventory performance.",
      icon: BarChart3,
      href: "/reports",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Liquor Inventory Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your liquor inventory operations with our comprehensive management system. 
            Track inventory, manage vendors, create purchase orders, and generate insightful reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.href}>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your inventory levels in real-time</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Vendor Management</h3>
                <p className="text-sm text-gray-600">Maintain detailed vendor information and relationships</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Purchase Orders</h3>
                <p className="text-sm text-gray-600">Streamlined purchase order creation and tracking</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Comprehensive reports and business insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
