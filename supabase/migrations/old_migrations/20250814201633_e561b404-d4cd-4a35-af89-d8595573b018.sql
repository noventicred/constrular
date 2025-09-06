-- Update existing products with SKU
UPDATE products SET sku = 'SKU-' || SUBSTRING(id::text, 1, 8) WHERE sku IS NULL;