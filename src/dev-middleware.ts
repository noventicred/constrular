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
    categoryId: '1',
    isFeatured: true,
    isSpecialOffer: true,
    inStock: true,
    stockQuantity: 25,
    description: 'Furadeira elétrica profissional com mandril de 13mm',
    brand: 'Black & Decker',
    rating: 4.5,
    reviewCount: 42,
    tags: ['furadeira', 'elétrica', 'profissional'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  { 
    id: '2', 
    name: 'Cabo Flexível 2,5mm²', 
    price: 285.00, 
    imageUrl: '/placeholder.svg',
    sku: 'PIR-CAB-25',
    category: 'Material Elétrico',
    categoryId: '2',
    isFeatured: true,
    isSpecialOffer: false,
    inStock: true,
    stockQuantity: 15,
    description: 'Cabo flexível para instalações elétricas residenciais',
    brand: 'Pirelli',
    rating: 4.8,
    reviewCount: 28,
    tags: ['cabo', 'elétrico', 'flexível'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

const mockUsers = [
  {
    id: '1',
    email: 'admin@constrular.com',
    fullName: 'Administrador',
    isAdmin: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2', 
    email: 'cliente@exemplo.com',
    fullName: 'Cliente Exemplo',
    isAdmin: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

const mockOrders = [
  {
    id: '1',
    userId: '2',
    user: { fullName: 'Cliente Exemplo', email: 'cliente@exemplo.com' },
    status: 'PENDING',
    total: 189.90,
    createdAt: new Date('2024-01-25'),
    items: [
      {
        id: '1',
        productId: '1',
        product: { name: 'Furadeira Black & Decker 500W' },
        quantity: 1,
        price: 189.90
      }
    ]
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

        // Products by ID
        if (req.method === 'GET' && req.url?.match(/^\/products\/[^\/]+$/)) {
          const productId = req.url.split('/').pop();
          const product = mockProducts.find(p => p.id === productId);
          
          if (!product) {
            console.log('❌ Product not found:', productId);
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Produto não encontrado' }));
            return;
          }
          
          console.log('📦 Product found:', product.name);
          res.statusCode = 200;
          res.end(JSON.stringify({ product }));
          return;
        }

        // Products listing
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

        // Categories CRUD
        if (req.method === 'POST' && req.url === '/categories') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const newCategory = {
                id: Date.now().toString(),
                ...data,
                parent_id: null
              };
              mockCategories.push(newCategory);
              console.log('📂 Category created:', newCategory.name);
              res.statusCode = 201;
              res.end(JSON.stringify({ category: newCategory }));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // Products CRUD
        if (req.method === 'POST' && req.url === '/products') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const newProduct = {
                id: Date.now().toString(),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              mockProducts.push(newProduct);
              console.log('📦 Product created:', newProduct.name);
              res.statusCode = 201;
              res.end(JSON.stringify({ product: newProduct }));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        if (req.method === 'PUT' && req.url?.match(/^\/products\/[^\/]+$/)) {
          const productId = req.url.split('/').pop();
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const productIndex = mockProducts.findIndex(p => p.id === productId);
              
              if (productIndex === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Produto não encontrado' }));
                return;
              }
              
              mockProducts[productIndex] = {
                ...mockProducts[productIndex],
                ...data,
                updatedAt: new Date()
              };
              
              console.log('📦 Product updated:', mockProducts[productIndex].name);
              res.statusCode = 200;
              res.end(JSON.stringify({ product: mockProducts[productIndex] }));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        if (req.method === 'DELETE' && req.url?.match(/^\/products\/[^\/]+$/)) {
          const productId = req.url.split('/').pop();
          const productIndex = mockProducts.findIndex(p => p.id === productId);
          
          if (productIndex === -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Produto não encontrado' }));
            return;
          }
          
          const deletedProduct = mockProducts.splice(productIndex, 1)[0];
          console.log('🗑️ Product deleted:', deletedProduct.name);
          res.statusCode = 200;
          res.end(JSON.stringify({ message: 'Produto excluído com sucesso' }));
          return;
        }

        // Users endpoints
        if (req.method === 'GET' && req.url === '/users') {
          console.log('👥 Getting all users:', mockUsers.length);
          const usersWithoutPassword = mockUsers.map(({ ...user }) => user);
          res.statusCode = 200;
          res.end(JSON.stringify({ users: usersWithoutPassword }));
          return;
        }

        // Orders endpoints
        if (req.method === 'GET' && req.url === '/orders') {
          console.log('📋 Getting all orders:', mockOrders.length);
          res.statusCode = 200;
          res.end(JSON.stringify({ orders: mockOrders }));
          return;
        }

        // Dashboard stats
        if (req.method === 'GET' && req.url === '/dashboard/stats') {
          const stats = {
            totalProducts: mockProducts.length,
            totalCategories: mockCategories.length,
            totalUsers: mockUsers.length,
            totalOrders: mockOrders.length,
            revenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
            featuredProducts: mockProducts.filter(p => p.isFeatured).length,
            specialOffers: mockProducts.filter(p => p.isSpecialOffer).length
          };
          console.log('📊 Dashboard stats requested');
          res.statusCode = 200;
          res.end(JSON.stringify({ stats }));
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
