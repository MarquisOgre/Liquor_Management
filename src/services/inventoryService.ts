
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem } from "@/types/inventory";
import { format } from "date-fns";

export interface InventoryRecord {
  id?: string;
  date: string;
  brand: string;
  size: string;
  opening_balance: number;
  purchase: number;
  closing_stock: number;
  sales: number;
  created_at?: string;
  updated_at?: string;
}

export const inventoryService = {
  async getInventoryByDate(date: Date): Promise<InventoryRecord[]> {
    const dateString = format(date, 'yyyy-MM-dd');
    console.log("Fetching inventory for date:", dateString);
    
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('date', dateString)
      .order('brand', { ascending: true })
      .order('size', { ascending: true });

    if (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }

    console.log("Fetched inventory records:", data?.length || 0);
    return data || [];
  },

  async saveInventoryItem(item: InventoryRecord): Promise<InventoryRecord> {
    console.log("Saving inventory item:", item);
    
    const { data, error } = await supabase
      .from('inventory')
      .upsert({
        date: item.date,
        brand: item.brand,
        size: item.size,
        opening_balance: item.opening_balance,
        purchase: item.purchase,
        closing_stock: item.closing_stock,
        sales: item.sales
      }, {
        onConflict: 'date,brand,size'
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving inventory item:", error);
      throw error;
    }

    console.log("Saved inventory item:", data);
    return data;
  },

  async saveAllInventory(items: InventoryRecord[]): Promise<InventoryRecord[]> {
    console.log("Saving all inventory items:", items.length);
    
    const { data, error } = await supabase
      .from('inventory')
      .upsert(items.map(item => ({
        date: item.date,
        brand: item.brand,
        size: item.size,
        opening_balance: item.opening_balance,
        purchase: item.purchase,
        closing_stock: item.closing_stock,
        sales: item.sales
      })), {
        onConflict: 'date,brand,size'
      })
      .select();

    if (error) {
      console.error("Error saving inventory:", error);
      throw error;
    }

    console.log("Saved inventory items:", data?.length || 0);
    return data || [];
  }
};
