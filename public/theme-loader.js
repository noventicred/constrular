// Script para carregar cores imediatamente - evita flash da cor antiga
(function() {
  // Carregar cor do localStorage
  const savedColor = localStorage.getItem('app-primary-color');
  const savedHSL = localStorage.getItem('app-primary-hsl');
  
  if (savedColor && savedHSL) {
    const root = document.documentElement;
    
    // Aplicar cores imediatamente
    root.style.setProperty('--primary', savedHSL);
    root.style.setProperty('--accent', savedHSL);
    root.style.setProperty('--ring', savedHSL);
    root.style.setProperty('--construction-orange', savedHSL);
    
    // Extrair valores HSL para variações
    const hslMatch = savedHSL.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      const lighterL = Math.min(100, parseInt(l) + 10);
      
      root.style.setProperty('--hero-gradient', `linear-gradient(135deg, hsl(${h} ${s}% ${l}%), hsl(${h} ${s}% ${lighterL}%))`);
      root.style.setProperty('--shadow-soft', `0 2px 20px -5px hsl(${h} ${s}% ${l}% / 0.1)`);
      root.style.setProperty('--shadow-strong', `0 10px 40px -10px hsl(${h} ${s}% ${l}% / 0.3)`);
      root.style.setProperty('--sidebar-primary', `${h} ${s}% ${Math.max(10, parseInt(l) - 20)}%`);
      root.style.setProperty('--sidebar-ring', savedHSL);
    }
    
    // Marcar que as cores foram carregadas
    root.setAttribute('data-theme-loaded', 'true');
  }
})();