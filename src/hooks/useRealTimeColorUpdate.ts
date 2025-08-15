import { useEffect } from 'react';

export const useRealTimeColorUpdate = (primaryColor: string) => {
  useEffect(() => {
    if (primaryColor && primaryColor !== '#000000') {
      // Converter hex para HSL
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
      };

      const [h, s, l] = hexToHsl(primaryColor);
      const root = document.documentElement;
      
      // Aplicar todas as variações de cor
      root.style.setProperty('--primary', `${h} ${s}% ${l}%`);
      root.style.setProperty('--accent', `${h} ${s}% ${l}%`);
      root.style.setProperty('--ring', `${h} ${s}% ${l}%`);
      root.style.setProperty('--construction-orange', `${h} ${s}% ${l}%`);
      
      // Gradientes dinâmicos
      const lighterL = Math.min(100, l + 10);
      root.style.setProperty('--hero-gradient', `linear-gradient(135deg, hsl(${h} ${s}% ${l}%), hsl(${h} ${s}% ${lighterL}%))`);
      
      // Sombras
      root.style.setProperty('--shadow-soft', `0 2px 20px -5px hsl(${h} ${s}% ${l}% / 0.1)`);
      root.style.setProperty('--shadow-strong', `0 10px 40px -10px hsl(${h} ${s}% ${l}% / 0.3)`);
      
      // Sidebar
      root.style.setProperty('--sidebar-primary', `${h} ${s}% ${Math.max(10, l - 20)}%`);
      root.style.setProperty('--sidebar-ring', `${h} ${s}% ${l}%`);
    }
  }, [primaryColor]);
};