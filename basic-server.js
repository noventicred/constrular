const http = require('http');
const url = require('url');

const PORT = 3002;

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
    isFeatured: true,
    isSpecialOffer: true
  },
  { 
    id: '2', 
    name: 'Cabo Flexível 2,5mm²', 
    price: 285.00, 
    imageUrl: '/placeholder.svg',
    sku: 'PIR-CAB-25',
    isFeatured: true,
    isSpecialOffer: false
  }
];

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Routes
  if (method === 'GET' && pathname === '/health') {
    sendJSON(res, { status: 'OK', timestamp: new Date().toISOString() });
    return;
  }

  if (method === 'GET' && pathname === '/categories') {
    console.log('📂 Returning categories:', categories.length);
    sendJSON(res, { categories });
    return;
  }

  if (method === 'GET' && pathname === '/products') {
    const { featured, specialOffers, search } = query;
    let result = products;
    
    if (featured === 'true') {
      result = products.filter(p => p.isFeatured);
      console.log('⭐ Featured products:', result.length);
    } else if (specialOffers === 'true') {
      result = products.filter(p => p.isSpecialOffer);
      console.log('🏷️ Special offers:', result.length);
    } else if (search) {
      result = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      console.log('🔍 Search results for "' + search + '":', result.length);
    } else {
      console.log('📦 All products:', result.length);
    }
    
    sendJSON(res, { products: result });
    return;
  }

  if (method === 'POST' && pathname === '/auth/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('✅ Register user:', data.email);
        const user = {
          id: Date.now().toString(),
          email: data.email,
          fullName: data.fullName,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        sendJSON(res, { user }, 201);
      } catch (error) {
        console.error('Error parsing register data:', error);
        sendJSON(res, { error: 'Invalid JSON' }, 400);
      }
    });
    return;
  }

  if (method === 'POST' && pathname === '/auth/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login user:', data.email);
        const user = {
          id: '1',
          email: data.email,
          fullName: 'Usuário Teste',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        sendJSON(res, { user });
      } catch (error) {
        console.error('Error parsing login data:', error);
        sendJSON(res, { error: 'Invalid JSON' }, 400);
      }
    });
    return;
  }

  // 404
  console.log('❌ 404 -', method, pathname);
  sendJSON(res, { error: 'Endpoint não encontrado' }, 404);
});

server.listen(PORT, () => {
  console.log(`🚀 Basic HTTP Server rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📂 Categorias: http://localhost:${PORT}/categories`);
  console.log(`📦 Produtos: http://localhost:${PORT}/products`);
});
