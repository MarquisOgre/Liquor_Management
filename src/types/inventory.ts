
export interface InventoryItem {
  brand: string;
  size: string;
  openingBalance: number;
  purchase: number;
  closingStock: number;
  sales: number;
}

export const brands = [
  "IB", "Royal Stag", "MM Vodka", "Iconiq White", "MM Orange",
  "After Dark", "Mc Dowel", "Royal Challenge", "Mountain Oak",
  "8PMM", "Green Level", "Romano"
];

export const bottleSizes = ["720ML", "360ML", "180ML", "90ML"];
