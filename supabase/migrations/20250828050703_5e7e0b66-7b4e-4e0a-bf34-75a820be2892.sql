-- Atualizar o valor padrão de frete grátis para R$ 299
UPDATE settings 
SET value = '299' 
WHERE key = 'free_shipping_threshold' AND value = '199';

-- Inserir configuração se não existir
INSERT INTO settings (key, value, description)
SELECT 'free_shipping_threshold', '299', 'Valor mínimo para frete grátis'
WHERE NOT EXISTS (
  SELECT 1 FROM settings WHERE key = 'free_shipping_threshold'
);