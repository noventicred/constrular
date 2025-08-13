-- Add parent_id column to categories table for hierarchical structure
ALTER TABLE public.categories 
ADD COLUMN parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;

-- Create index for better performance on parent_id queries
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

-- Add a check to prevent self-referencing categories
ALTER TABLE public.categories 
ADD CONSTRAINT check_no_self_reference 
CHECK (id != parent_id);