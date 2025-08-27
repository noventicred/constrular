const express = require('express');
const cors = require('cors');

console.log('🚀 Iniciando servidor de desenvolvimento da API...');

// Simular as APIs com dados mocados por enquanto
const mockCategories = [
  { id: '1', name: 'Ferramentas', description: 'Ferramentas para construção', imageUrl: '/placeholder.svg', parent_id: null },
  { id: '2', name: 'Material Elétrico', description: 'Componentes elétricos', imageUrl: '/placeholder.svg', parent_id: null }
];

const mockProducts = [
  { 
    id: '1', 
    name: 'Furadeira Black & Decker 500W', 
    price: 189.90, 
    imageUrl: '/placeholder.svg',
    sku: 'BD-FUR-500',
    category: 'Ferramentas',
    isFeatured: true,
    isSpecialOffer: true
  },
  { 
    id: '2', 
    name: 'Cabo Flexível 2,5mm²', 
    price: 285.00, 
    imageUrl: '/placeholder.svg',
    sku: 'PIR-CAB-25',
    category: 'Material Elétrico',
    isFeatured: true,
    isSpecialOffer: false
  }
];

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body || '');
  next();
});

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    // Mock user creation for now
    const mockUser = {
      id: Date.now().toString(),
      email: req.body.email,
      fullName: req.body.fullName,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Mock user created:', mockUser.email);
    res.status(201).json({ user: mockUser });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    // Mock login for now
    const mockUser = {
      id: '1',
      email: req.body.email,
      fullName: 'Usuário Teste',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Mock login:', mockUser.email);
    res.status(200).json({ user: mockUser });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Category Routes
app.get('/categories', async (req, res) => {
  try {
    console.log('Buscando categorias...');
    res.status(200).json({ categories: mockCategories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const newCategory = {
      id: Date.now().toString(),
      ...req.body,
      parent_id: null
    };
    mockCategories.push(newCategory);
    res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Product Routes
app.get('/products', async (req, res) => {
  try {
    const { featured, specialOffers, search } = req.query;
    
    if (featured === 'true') {
      const products = mockProducts.filter(p => p.isFeatured);
      console.log('Buscando produtos em destaque:', products.length);
      return res.status(200).json({ products });
    }
    
    if (specialOffers === 'true') {
      const products = mockProducts.filter(p => p.isSpecialOffer);
      console.log('Buscando ofertas especiais:', products.length);
      return res.status(200).json({ products });
    }
    
    if (search) {
      const products = mockProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log('Buscando produtos:', search, products.length);
      return res.status(200).json({ products });
    }
    
    console.log('Buscando todos os produtos:', mockProducts.length);
    res.status(200).json({ products: mockProducts });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = mockProducts.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    console.log('Produto encontrado:', product.name);
    res.status(200).json({ product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// User Routes
app.get('/users/:id', async (req, res) => {
  try {
    // Mock user data
    const mockUser = {
      id: req.params.id,
      email: 'user@example.com',
      fullName: 'Usuário Teste',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Buscando usuário:', req.params.id);
    res.status(200).json({ user: mockUser });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    // Mock user update
    const updatedUser = {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date()
    };
    
    console.log('Atualizando usuário:', req.params.id);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/users/:id/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log('Alterando senha para usuário:', req.params.id);
    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, () => {
  console.log(`🚀 Dev API Server rodando na porta ${PORT}`);
  console.log(`📍 Endpoints disponíveis em http://localhost:${PORT}`);
});
