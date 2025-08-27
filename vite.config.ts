import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      // Proxy para APIs durante desenvolvimento
      '/api': {
        target: mode === 'development' ? 'http://localhost:3000' : undefined,
        changeOrigin: true,
        configure: (proxy, options) => {
          // Em desenvolvimento, usar APIs mockadas localmente se necessário
          // Em produção, usar as APIs do Vercel
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["@prisma/client", "@neondatabase/serverless", "bcryptjs"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  }
}));
