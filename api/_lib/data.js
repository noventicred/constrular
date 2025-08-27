/**
 * Dados mockados centralizados para todas as APIs
 * Base de dados em memória para desenvolvimento e demonstração
 */

// Categorias
export const mockCategories = [
  {
    id: "1",
    name: "Ferramentas",
    description: "Ferramentas profissionais para construção civil",
    imageUrl: "/placeholder.svg",
    parent_id: null,
    slug: "ferramentas",
    active: true,
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Material Elétrico",
    description: "Materiais elétricos e eletrônicos para instalações",
    imageUrl: "/placeholder.svg",
    parent_id: null,
    slug: "material-eletrico",
    active: true,
    createdAt: "2024-01-16T00:00:00.000Z",
    updatedAt: "2024-01-16T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Cimento e Argamassa",
    description: "Cimentos, argamassas e materiais de base",
    imageUrl: "/placeholder.svg",
    parent_id: null,
    slug: "cimento-argamassa",
    active: true,
    createdAt: "2024-01-17T00:00:00.000Z",
    updatedAt: "2024-01-17T00:00:00.000Z"
  },
  {
    id: "4",
    name: "Tintas e Vernizes",
    description: "Tintas, vernizes e materiais de acabamento",
    imageUrl: "/placeholder.svg",
    parent_id: null,
    slug: "tintas-vernizes",
    active: true,
    createdAt: "2024-01-18T00:00:00.000Z",
    updatedAt: "2024-01-18T00:00:00.000Z"
  },
  {
    id: "5",
    name: "Hidráulica",
    description: "Materiais hidráulicos e sanitários",
    imageUrl: "/placeholder.svg",
    parent_id: null,
    slug: "hidraulica",
    active: true,
    createdAt: "2024-01-19T00:00:00.000Z",
    updatedAt: "2024-01-19T00:00:00.000Z"
  }
];

// Produtos
export const mockProducts = [
  {
    id: "1",
    name: "Furadeira Black & Decker 500W",
    description: "Furadeira elétrica profissional com mandril de 13mm. Ideal para furos em madeira, metal e alvenaria. Inclui maleta e conjunto de brocas.",
    price: 189.90,
    originalPrice: 229.90,
    imageUrl: "/placeholder.svg",
    sku: "BD-FUR-500",
    category: "Ferramentas",
    categoryId: "1",
    brand: "Black & Decker",
    isFeatured: true,
    isSpecialOffer: true,
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 42,
    weight: 1.2,
    dimensions: "25x8x20cm",
    warranty: "12 meses",
    tags: ["furadeira", "elétrica", "profissional", "black-decker"],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Cabo Flexível 2,5mm² - 100m",
    description: "Cabo flexível para instalações elétricas residenciais e comerciais. Condutor de cobre, isolação em PVC, 750V.",
    price: 285.50,
    imageUrl: "/placeholder.svg",
    sku: "PIR-CAB-25",
    category: "Material Elétrico",
    categoryId: "2",
    brand: "Pirelli",
    isFeatured: true,
    isSpecialOffer: false,
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 28,
    weight: 8.5,
    dimensions: "Rolo 100m",
    warranty: "24 meses",
    tags: ["cabo", "elétrico", "flexível", "pirelli", "2.5mm"],
    createdAt: "2024-01-20T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Cimento Portland CP-II-Z-32 50kg",
    description: "Cimento Portland comum para construção civil. Ideal para concreto, argamassa e estruturas em geral.",
    price: 35.90,
    originalPrice: 42.90,
    imageUrl: "/placeholder.svg",
    sku: "VOT-CIM-50",
    category: "Cimento e Argamassa",
    categoryId: "3",
    brand: "Votorantim",
    isFeatured: false,
    isSpecialOffer: true,
    inStock: true,
    stockQuantity: 50,
    rating: 4.6,
    reviewCount: 89,
    weight: 50,
    dimensions: "Saco 50kg",
    warranty: "Não se aplica",
    tags: ["cimento", "portland", "construção", "votorantim", "50kg"],
    createdAt: "2024-01-22T00:00:00.000Z",
    updatedAt: "2024-01-22T00:00:00.000Z"
  },
  {
    id: "4",
    name: "Tinta Acrílica Premium Branca 18L",
    description: "Tinta acrílica premium para paredes internas e externas. Excelente cobertura, resistente ao tempo e fácil aplicação.",
    price: 125.90,
    imageUrl: "/placeholder.svg",
    sku: "SUV-TIN-18",
    category: "Tintas e Vernizes",
    categoryId: "4",
    brand: "Suvinil",
    isFeatured: true,
    isSpecialOffer: false,
    inStock: true,
    stockQuantity: 12,
    rating: 4.7,
    reviewCount: 67,
    weight: 22,
    dimensions: "Lata 18L",
    warranty: "12 meses",
    tags: ["tinta", "acrílica", "premium", "suvinil", "branca", "18l"],
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z"
  },
  {
    id: "5",
    name: "Registro de Gaveta Bronze 3/4\"",
    description: "Registro de gaveta em bronze para instalações hidráulicas. Rosca 3/4 polegada, alta durabilidade.",
    price: 45.90,
    originalPrice: 52.90,
    imageUrl: "/placeholder.svg",
    sku: "DOC-REG-34",
    category: "Hidráulica",
    categoryId: "5",
    brand: "Docol",
    isFeatured: false,
    isSpecialOffer: true,
    inStock: true,
    stockQuantity: 8,
    rating: 4.4,
    reviewCount: 23,
    weight: 0.8,
    dimensions: "3/4\"",
    warranty: "60 meses",
    tags: ["registro", "gaveta", "hidráulica", "docol", "bronze", "3/4"],
    createdAt: "2024-01-28T00:00:00.000Z",
    updatedAt: "2024-01-28T00:00:00.000Z"
  },
  {
    id: "6",
    name: "Parafusadeira Bosch 12V Li-Ion",
    description: "Parafusadeira sem fio com bateria de 12V Li-Ion. Inclui carregador, maleta e conjunto de bits. Ideal para uso profissional.",
    price: 299.90,
    imageUrl: "/placeholder.svg",
    sku: "BSH-PAR-12",
    category: "Ferramentas",
    categoryId: "1",
    brand: "Bosch",
    isFeatured: true,
    isSpecialOffer: false,
    inStock: true,
    stockQuantity: 18,
    rating: 4.9,
    reviewCount: 156,
    weight: 1.1,
    dimensions: "22x6x18cm",
    warranty: "24 meses",
    tags: ["parafusadeira", "sem fio", "bateria", "bosch", "12v", "li-ion"],
    createdAt: "2024-01-30T00:00:00.000Z",
    updatedAt: "2024-01-30T00:00:00.000Z"
  }
];

// Configurações da loja
export const mockSettings = {
  whatsapp_number: "5511999999999",
  store_name: "ConstrutorPro",
  store_email: "contato@construtorpro.com",
  store_phone: "(11) 3456-7890",
  store_address: "Rua das Construções, 123 - São Paulo, SP - CEP: 01234-567",
  free_shipping_threshold: "199.00",
  default_shipping_cost: "29.90",
  business_hours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
  payment_methods: ["PIX", "Cartão de Crédito", "Cartão de Débito", "Boleto Bancário"],
  delivery_areas: ["São Paulo Capital", "Grande São Paulo", "ABC Paulista", "Guarulhos", "Osasco"],
  social_media: {
    facebook: "https://facebook.com/construtorpro",
    instagram: "https://instagram.com/construtorpro",
    youtube: "https://youtube.com/construtorpro",
    linkedin: "https://linkedin.com/company/construtorpro"
  },
  seo: {
    meta_title: "ConstrutorPro - Material de Construção Online | Melhor Preço",
    meta_description: "Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais. Entrega rápida em São Paulo.",
    keywords: "material de construção, cimento, tijolo, tinta, ferramentas, construção civil, obra, reforma"
  },
  features: {
    free_shipping_enabled: true,
    reviews_enabled: true,
    wishlist_enabled: true,
    compare_enabled: true,
    chat_enabled: true
  },
  updated_at: new Date().toISOString()
};

// Usuários mockados
export const mockUsers = [
  {
    id: "1",
    email: "admin@construtorpro.com",
    full_name: "Administrador do Sistema",
    phone: "(11) 99999-9999",
    is_admin: true,
    active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    email: "cliente@exemplo.com",
    full_name: "Cliente Exemplo",
    phone: "(11) 98888-8888",
    is_admin: false,
    active: true,
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-10T00:00:00.000Z"
  }
];
