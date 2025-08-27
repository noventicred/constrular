-- Atualizar ratings e reviews dos produtos baseado nos comentários reais
UPDATE products 
SET rating = COALESCE(
  (SELECT AVG(rating) FROM product_comments WHERE product_id = products.id AND rating IS NOT NULL), 
  0
),
reviews = COALESCE(
  (SELECT COUNT(*) FROM product_comments WHERE product_id = products.id), 
  0
)
WHERE id IN (
  SELECT DISTINCT id FROM products 
  WHERE is_featured = true OR is_special_offer = true
);