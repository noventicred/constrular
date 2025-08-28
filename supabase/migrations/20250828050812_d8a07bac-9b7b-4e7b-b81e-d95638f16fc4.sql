-- Forçar atualização do valor de frete grátis para R$ 299
UPDATE settings 
SET value = '299' 
WHERE key = 'free_shipping_threshold';

-- Se não existir, inserir
INSERT INTO settings (key, value, description)
SELECT 'free_shipping_threshold', '299', 'Valor mínimo para frete grátis'
WHERE NOT EXISTS (
  SELECT 1 FROM settings WHERE key = 'free_shipping_threshold'
);