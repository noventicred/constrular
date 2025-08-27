-- Corrigir o produto Fio Flexível que ainda tem dados fictícios
UPDATE products 
SET rating = COALESCE(
  (SELECT AVG(rating) FROM product_comments WHERE product_id = products.id AND rating IS NOT NULL), 
  0
),
reviews = COALESCE(
  (SELECT COUNT(*) FROM product_comments WHERE product_id = products.id), 
  0
)
WHERE name LIKE '%Fio Flexível%';