import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  review_count: number;
  is_featured: boolean;
  description: string | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    // Produtos mockados para demonstração
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Cimento Portland CP II-E 50kg",
        price: 29.9,
        original_price: 35.9,
        image_url: "/placeholder.svg",
        rating: 4.8,
        review_count: 125,
        is_featured: true,
        description: "Cimento de alta qualidade para construção civil",
      },
      {
        id: "2",
        name: "Tijolo Cerâmico 9 Furos",
        price: 0.89,
        image_url: "/placeholder.svg",
        rating: 4.6,
        review_count: 89,
        is_featured: true,
        description: "Tijolo cerâmico de alta resistência",
      },
      {
        id: "3",
        name: "Tinta Acrílica Premium 18L",
        price: 189.9,
        original_price: 220.0,
        image_url: "/placeholder.svg",
        rating: 4.9,
        review_count: 67,
        is_featured: true,
        description: "Tinta acrílica lavável de alta cobertura",
      },
      {
        id: "4",
        name: "Areia Média para Construção",
        price: 45.9,
        image_url: "/placeholder.svg",
        rating: 4.5,
        review_count: 203,
        is_featured: true,
        description: "Areia lavada e peneirada para construção",
      },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Os melhores produtos para sua obra
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-gray-600">
            Os melhores produtos para sua obra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.original_price &&
                  product.original_price > product.price && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      -
                      {Math.round(
                        ((product.original_price - product.price) /
                          product.original_price) *
                          100
                      )}
                      %
                    </Badge>
                  )}
                <Badge className="absolute top-2 right-2 bg-blue-500">
                  Destaque
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(product.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.review_count})
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.original_price &&
                    product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.original_price)}
                      </span>
                    )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button asChild variant="outline" size="sm" className="px-3">
                    <Link to={`/produto/${product.id}`}>Ver</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/produtos">Ver Todos os Produtos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
