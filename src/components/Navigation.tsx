
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, Package, Users, FileText, ShoppingCart, BarChart3, Receipt } from 'lucide-react';

const Navigation = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - Complete Left */}
        <div className="flex items-center gap-4">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=40&h=40&fit=crop&crop=center" 
            alt="Logo" 
            className="w-10 h-10 rounded-lg object-cover"
          />
          <h1 
            className="text-xl font-bold text-gray-900 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Liquor Inventory
          </h1>
        </div>
        
        {/* Navigation Menu - Center */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/inventory')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Track Stock
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/purchase-invoices')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Purchase Invoice
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/vendors')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Suppliers
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/brands')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Brands
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Expenses
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </div>
        
        {/* User Info & Actions - Complete Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{profile?.full_name || user.email}</span>
            {isAdmin && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                Admin
              </span>
            )}
          </div>
          
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
