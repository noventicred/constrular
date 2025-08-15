-- Adicionar novas configurações do sistema para personalização da empresa
INSERT INTO settings (key, value, description) VALUES
('company_name', 'ConstrutorPro', 'Nome da empresa exibido no site'),
('company_address', 'Rua das Construções, 123 - Centro', 'Endereço da empresa'),
('company_phone', '(11) 99999-9999', 'Telefone principal da empresa'),
('company_email', 'contato@construtorpro.com', 'E-mail principal da empresa'),
('company_cnpj', '12.345.678/0001-90', 'CNPJ da empresa'),
('primary_color', '#2563eb', 'Cor principal do site (formato hex)'),
('primary_color_rgb', '37, 99, 235', 'Cor principal em RGB para CSS variables'),
('site_title', 'ConstrutorPro - Material de Construção', 'Título do site para SEO'),
('site_description', 'Loja completa de material de construção com os melhores preços', 'Descrição do site para SEO')
ON CONFLICT (key) DO NOTHING;