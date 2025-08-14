-- Create comments table
CREATE TABLE public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.product_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert comments" 
ON public.product_comments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Only admins can update comments" 
ON public.product_comments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Only admins can delete comments" 
ON public.product_comments 
FOR DELETE 
USING (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

-- Add trigger for updated_at
CREATE TRIGGER update_product_comments_updated_at
  BEFORE UPDATE ON public.product_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();