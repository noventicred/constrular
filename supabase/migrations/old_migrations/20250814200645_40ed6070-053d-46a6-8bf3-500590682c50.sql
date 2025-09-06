-- Add SKU field to products table
ALTER TABLE public.products 
ADD COLUMN sku TEXT;

-- Create index for SKU searches
CREATE INDEX idx_products_sku ON public.products(sku);

-- Add constraint to ensure SKU is unique when not null
ALTER TABLE public.products 
ADD CONSTRAINT unique_product_sku UNIQUE (sku);