import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  image_url: string | null;
  category_id: string | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  is_special_offer: boolean | null;
  sku: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

interface SearchFilters {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
  onlyOffers: boolean;
  inStock: boolean;
  minRating: number;
  sortBy: string;
}

export const useAdvancedSearch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: 'todas',
    priceRange: [0, 10000],
    onlyOffers: false,
    inStock: true,
    minRating: 0,
    sortBy: 'relevancia'
  });

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (filters.searchTerm.length >= 2) {
      generateSuggestions(filters.searchTerm);
    } else {
      setSearchSuggestions([]);
    }
  }, [filters.searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();

    products.forEach(product => {
      // Add product names that match
      if (product.name.toLowerCase().includes(term)) {
        suggestions.add(product.name);
      }

      // Add words from product names
      const words = product.name.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.includes(term) && word.length > 2) {
          suggestions.add(word);
        }
      });

      // Add category names
      if (product.categories?.name.toLowerCase().includes(term)) {
        suggestions.add(product.categories.name);
      }

      // Add description words
      if (product.description) {
        const descWords = product.description.toLowerCase().split(' ');
        descWords.forEach(word => {
          if (word.includes(term) && word.length > 3) {
            suggestions.add(word);
          }
        });
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 8));
  };

  // Advanced filtering with multiple criteria
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Text search (name, description, category, SKU)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesDescription = product.description?.toLowerCase().includes(term);
        const matchesCategory = product.categories?.name.toLowerCase().includes(term);
        const matchesSku = product.sku?.toLowerCase().includes(term);
        
        return matchesName || matchesDescription || matchesCategory || matchesSku;
      });
    }

    // Category filter
    if (filters.category !== 'todas') {
      filtered = filtered.filter(product => product.categories?.id === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Offers filter
    if (filters.onlyOffers) {
      filtered = filtered.filter(product => product.is_special_offer === true);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.in_stock === true);
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => (product.rating || 0) >= filters.minRating);
    }

    return filtered;
  }, [products, filters]);

  // Smart sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (filters.sortBy) {
      case 'relevancia':
        // Sort by relevance (search term matches)
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          return sorted.sort((a, b) => {
            const aScore = getRelevanceScore(a, term);
            const bScore = getRelevanceScore(b, term);
            return bScore - aScore;
          });
        }
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      case 'preco-menor':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'preco-maior':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'nome':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'avaliacao':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      case 'desconto':
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      
      case 'mais-vendido':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      
      default:
        return sorted;
    }
  }, [filteredProducts, filters.sortBy, filters.searchTerm]);

  // Calculate relevance score for search
  const getRelevanceScore = (product: Product, searchTerm: string): number => {
    let score = 0;
    const term = searchTerm.toLowerCase();

    // Exact match in name gets highest score
    if (product.name.toLowerCase() === term) score += 100;
    
    // Name starts with search term
    if (product.name.toLowerCase().startsWith(term)) score += 50;
    
    // Name contains search term
    if (product.name.toLowerCase().includes(term)) score += 30;
    
    // Category matches
    if (product.categories?.name.toLowerCase().includes(term)) score += 20;
    
    // Description contains term
    if (product.description?.toLowerCase().includes(term)) score += 10;
    
    // SKU matches
    if (product.sku?.toLowerCase().includes(term)) score += 15;
    
    // Boost for special offers
    if (product.is_special_offer) score += 5;
    
    // Boost for high ratings
    if (product.rating && product.rating >= 4) score += 3;
    
    return score;
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'todas',
      priceRange: [0, 10000],
      onlyOffers: false,
      inStock: true,
      minRating: 0,
      sortBy: 'relevancia'
    });
  };

  return {
    products: sortedProducts,
    loading,
    filters,
    updateFilters,
    resetFilters,
    searchSuggestions,
    totalResults: filteredProducts.length
  };
};