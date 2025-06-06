
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Home, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const brands = [
  "IB", "Royal Stag", "MM Vodka", "Iconiq White", "MM Orange",
  "After Dark", "Mc Dowel", "Royal Challenge", "Mountain Oak",
  "8PMM", "Green Level", "Romano"
];

const bottleSizes = ["720ML", "360ML", "180ML", "90ML"];

interface PurchaseOrderItem {
  brand: string;
  size: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendor: string;
  orderDate: Date;
  expectedDelivery: Date;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
}

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [expectedDelivery, setExpectedDelivery] = useState<Date>(new Date());
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Load vendors from localStorage
    const savedVendors = localStorage.getItem('vendors');
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors));
    }

    // Generate order number
    const lastOrderNum = localStorage.getItem('lastOrderNumber') || '0';
    const newOrderNum = (parseInt(lastOrderNum) + 1).toString().padStart(6, '0');
    setOrderNumber(`PO${newOrderNum}`);
  }, []);

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      brand: "",
      size: "",
      quantity: 0,
      rate: 0,
      amount: 0
    }]);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setOrderItems(newItems);
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const savePurchaseOrder = () => {
    if (!selectedVendor || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select a vendor and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const purchaseOrder: PurchaseOrder = {
      id: Date.now().toString(),
      orderNumber,
      vendor: selectedVendor,
      orderDate,
      expectedDelivery,
      items: orderItems,
      totalAmount: getTotalAmount(),
      status: 'pending'
    };

    // Save purchase order
    const savedOrders = localStorage.getItem('purchaseOrders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(purchaseOrder);
    localStorage.setItem('purchaseOrders', JSON.stringify(orders));

    // Update last order number
    const orderNum = parseInt(orderNumber.replace('PO', ''));
    localStorage.setItem('lastOrderNumber', orderNum.toString());

    toast({
      title: "Purchase Order Created",
      description: `Purchase order ${orderNumber} has been created successfully.`,
    });

    // Reset form
    setSelectedVendor("");
    setOrderItems([]);
    const newOrderNum = (orderNum + 1).toString().padStart(6, '0');
    setOrderNumber(`PO${newOrderNum}`);
  };

  const receivePurchaseOrder = () => {
    if (!selectedVendor || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select a vendor and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    // Update inventory with received items
    const inventoryKey = `inventory_${format(new Date(), 'yyyy-MM-dd')}`;
    const savedInventory = localStorage.getItem(inventoryKey);
    let inventory = savedInventory ? JSON.parse(savedInventory) : [];

    // If no inventory exists for today, create it
    if (inventory.length === 0) {
      brands.forEach(brand => {
        bottleSizes.forEach(size => {
          inventory.push({
            brand,
            size,
            openingBalance: 0,
            purchase: 0,
            closingStock: 0,
            sales: 0
          });
        });
      });
    }

    // Update purchase quantities
    orderItems.forEach(orderItem => {
      const inventoryItem = inventory.find((item: any) => 
        item.brand === orderItem.brand && item.size === orderItem.size
      );
      if (inventoryItem) {
        inventoryItem.purchase += orderItem.quantity;
        inventoryItem.sales = inventoryItem.openingBalance + inventoryItem.purchase - inventoryItem.closingStock;
      }
    });

    localStorage.setItem(inventoryKey, JSON.stringify(inventory));

    // Save as received purchase order
    savePurchaseOrder();

    toast({
      title: "Purchase Order Received",
      description: `Items have been added to inventory for ${format(new Date(), 'PPP')}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
              <h1 className="text-3xl font-bold text-gray-800">Purchase Order</h1>
            </div>
          </div>
        </div>

        {/* Purchase Order Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Purchase Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Order Number</label>
                <Input value={orderNumber} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vendor</label>
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !orderDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {orderDate ? format(orderDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={orderDate}
                      onSelect={(date) => date && setOrderDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Delivery</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expectedDelivery && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedDelivery ? format(expectedDelivery, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expectedDelivery}
                      onSelect={(date) => date && setExpectedDelivery(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Items</h3>
                <Button onClick={addOrderItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.brand}
                          onValueChange={(value) => updateOrderItem(index, 'brand', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.size}
                          onValueChange={(value) => updateOrderItem(index, 'size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {bottleSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateOrderItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeOrderItem(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {orderItems.length > 0 && (
                <div className="mt-4 text-right">
                  <div className="text-lg font-semibold">
                    Total Amount: ₹{getTotalAmount().toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <Button onClick={savePurchaseOrder} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Order
              </Button>
              <Button onClick={receivePurchaseOrder} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Receive & Add to Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrder;
