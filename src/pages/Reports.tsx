
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Package, DollarSign, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Inventory Summary */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Summary
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Total stock levels and product overview
              </p>
            </CardContent>
          </Card>

          {/* Sales Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sales Analytics
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Sales trends and performance metrics
              </p>
            </CardContent>
          </Card>

          {/* Purchase Analysis */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Purchase Analysis
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Purchase order trends and vendor analysis
              </p>
            </CardContent>
          </Card>

          {/* Stock Movement */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Movement
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Track inventory movement patterns
              </p>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Alerts
              </CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Items below minimum stock levels
              </p>
            </CardContent>
          </Card>

          {/* Vendor Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vendor Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">
                Vendor delivery and quality metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Reports Development Status</CardTitle>
            <CardDescription>
              The reporting and analytics features are currently under development. 
              These will provide comprehensive insights into your inventory performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Upcoming features will include:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Real-time inventory tracking and analytics</li>
              <li>Sales performance dashboards</li>
              <li>Purchase order analysis and vendor comparisons</li>
              <li>Stock movement and turnover reports</li>
              <li>Automated low stock alerts and reorder suggestions</li>
              <li>Financial performance metrics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
