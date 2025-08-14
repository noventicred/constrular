import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Produto from "./pages/Produto";
import Carrinho from "./pages/Carrinho";
import Auth from "./pages/Auth";
import SobreNos from "./pages/SobreNos";
import Contato from "./pages/Contato";
import Entrega from "./pages/Entrega";
import TrocaseDevolucoes from "./pages/TrocaseDevolucoes";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import Cookies from "./pages/Cookies";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import ProductForm from "./pages/admin/ProductForm";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produto/:id" element={<Produto />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/entrega" element={<Entrega />} />
            <Route path="/trocas-e-devolucoes" element={<TrocaseDevolucoes />} />
            <Route path="/termos-uso" element={<TermosUso />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="produtos/novo" element={<ProductForm />} />
              <Route path="produtos/editar/:id" element={<ProductForm />} />
              <Route path="categorias" element={<AdminCategories />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;