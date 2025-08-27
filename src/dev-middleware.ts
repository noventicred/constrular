import type { ViteDevServer } from 'vite';

// Dados mock
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

export function apiMockMiddleware() {
  return {
    name: 'api-mock',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api', (req, res, next) => {
        console.log(`🔧 API Mock: ${req.method} ${req.url}`);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        // Categories
        if (req.method === 'GET' && req.url === '/categories') {
          console.log('📂 Returning categories:', mockCategories.length);
          res.statusCode = 200;
          res.end(JSON.stringify({ categories: mockCategories }));
          return;
        }

        // Products
        if (req.method === 'GET' && req.url?.startsWith('/products')) {
          const url = new URL(req.url, 'http://localhost:3000');
          const featured = url.searchParams.get('featured');
          const specialOffers = url.searchParams.get('specialOffers');
          const search = url.searchParams.get('search');
          
          let result = mockProducts;
          
          if (featured === 'true') {
            result = mockProducts.filter(p => p.isFeatured);
            console.log('⭐ Featured products:', result.length);
          } else if (specialOffers === 'true') {
            result = mockProducts.filter(p => p.isSpecialOffer);
            console.log('🏷️ Special offers:', result.length);
          } else if (search) {
            result = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
            console.log('🔍 Search results for "' + search + '":', result.length);
          } else {
            console.log('📦 All products:', result.length);
          }
          
          res.statusCode = 200;
          res.end(JSON.stringify({ products: result }));
          return;
        }

        // Auth Register
        if (req.method === 'POST' && req.url === '/auth/register') {
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
              res.statusCode = 201;
              res.end(JSON.stringify({ user }));
            } catch (error) {
              console.error('Error parsing register data:', error);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // Auth Login
        if (req.method === 'POST' && req.url === '/auth/login') {
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
              res.statusCode = 200;
              res.end(JSON.stringify({ user }));
            } catch (error) {
              console.error('Error parsing login data:', error);
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // 404
        console.log('❌ 404 -', req.method, req.url);
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
      });
    }
  };
}
