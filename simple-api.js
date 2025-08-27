const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configuração básica
app.use(cors());
app.use(express.json());

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Dados mock
const categories = [
  { id: '1', name: 'Ferramentas', description: 'Ferramentas para construção', imageUrl: '/placeholder.svg' },
  { id: '2', name: 'Material Elétrico', description: 'Componentes elétricos', imageUrl: '/placeholder.svg' }
];

const products = [
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

// Rotas simples
app.get('/categories', (req, res) => {
  console.log('📂 GET /categories');
  res.json({ categories });
});

app.get('/products', (req, res) => {
  const { featured, specialOffers, search } = req.query;
  
  let result = products;
  
  if (featured === 'true') {
    result = products.filter(p => p.isFeatured);
    console.log('⭐ GET /products?featured=true -', result.length, 'produtos');
  } else if (specialOffers === 'true') {
    result = products.filter(p => p.isSpecialOffer);
    console.log('🏷️ GET /products?specialOffers=true -', result.length, 'produtos');
  } else if (search) {
    result = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    console.log('🔍 GET /products?search=' + search + ' -', result.length, 'produtos');
  } else {
    console.log('📦 GET /products -', result.length, 'produtos');
  }
  
  res.json({ products: result });
});

app.post('/auth/register', (req, res) => {
  console.log('✅ POST /auth/register -', req.body.email);
  const user = {
    id: Date.now().toString(),
    email: req.body.email,
    fullName: req.body.fullName,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.status(201).json({ user });
});

app.post('/auth/login', (req, res) => {
  console.log('🔐 POST /auth/login -', req.body.email);
  const user = {
    id: '1',
    email: req.body.email,
    fullName: 'Usuário Teste',
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.json({ user });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 -', req.method, req.originalUrl);
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📂 Categorias: http://localhost:${PORT}/categories`);
  console.log(`📦 Produtos: http://localhost:${PORT}/products`);
});
