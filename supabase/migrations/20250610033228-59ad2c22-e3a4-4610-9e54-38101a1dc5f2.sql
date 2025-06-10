
-- Rename purchase_orders table to purchase_invoices
ALTER TABLE purchase_orders RENAME TO purchase_invoices;

-- Rename purchase_order_items table to purchase_invoice_items
ALTER TABLE purchase_order_items RENAME TO purchase_invoice_items;

-- Rename the foreign key column in purchase_invoice_items
ALTER TABLE purchase_invoice_items RENAME COLUMN purchase_order_id TO purchase_invoice_id;

-- Update the po_number column to invoice_number
ALTER TABLE purchase_invoices RENAME COLUMN po_number TO invoice_number;
