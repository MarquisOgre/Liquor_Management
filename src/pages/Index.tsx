
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Users, Plus, FileText, Receipt, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Liquor Inventory Management System
          </h1>
          <p className="text-lg text-gray-600">
            Manage your liquor inventory, track purchases, and optimize your business operations
          </p>
        </div>

        {/* 3x2 Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto flex-shrink-0">
          {/* First Row */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/inventory')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Track Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Inventory Management</div>
              <p className="text-xs text-muted-foreground">
                Monitor your inventory levels and manage stock efficiently.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/purchase-invoices')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchase Invoice</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Create Invoices</div>
              <p className="text-xs text-muted-foreground">
                Create and manage purchase invoices for restocking.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vendors')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Vendor Management</div>
              <p className="text-xs text-muted-foreground">
                Manage your supplier relationships and contact information.
              </p>
            </CardContent>
          </Card>

          {/* Second Row */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/brands')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Brand Management</div>
              <p className="text-xs text-muted-foreground">
                Manage product brands and categories in your inventory.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/expenses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Expense Management</div>
              <p className="text-xs text-muted-foreground">
                Track and manage your business expenses efficiently.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Reports & Analytics</div>
              <p className="text-xs text-muted-foreground">
                View comprehensive business reports and analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Create Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/purchase-invoice')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Purchase Invoice
            </Button>
            <Button 
              onClick={() => navigate('/inventory')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              View Inventory
            </Button>
            <Button 
              onClick={() => navigate('/vendors')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Vendors
            </Button>
            <Button 
              onClick={() => navigate('/expenses')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
