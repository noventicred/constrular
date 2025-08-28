import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
  type?: "website" | "product" | "article";
}

const SEO: React.FC<SEOProps> = ({
  title = "Nova Casa Construção - Material de Construção Online",
  description = "Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais. Entrega rápida em Sorocaba.",
  keywords = "material de construção, cimento, tijolo, tinta, ferramentas, construção, obra, reforma, Sorocaba",
     ogImage = "/logo.png",
  canonicalUrl,
  structuredData,
  type = "website",
}) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;
  const finalCanonicalUrl = canonicalUrl || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll("meta[data-seo]");
    existingMetas.forEach((meta) => meta.remove());

    // Create meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: "Nova Casa Construção" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "pt-BR" },
      { name: "revisit-after", content: "7 days" },

      // Open Graph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: currentUrl },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: title },
      { property: "og:site_name", content: "Nova Casa Construção" },
      { property: "og:locale", content: "pt_BR" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: title },
    ];

    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if ("name" in tag) {
        meta.name = tag.name;
      } else if ("property" in tag) {
        meta.setAttribute("property", tag.property);
      }
      meta.content = tag.content;
      meta.setAttribute("data-seo", "true");
      document.head.appendChild(meta);
    });

    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add canonical link
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = finalCanonicalUrl;
    document.head.appendChild(canonical);

    // Remove existing structured data
    const existingStructuredData = document.querySelector(
      'script[type="application/ld+json"][data-seo]'
    );
    if (existingStructuredData) {
      existingStructuredData.remove();
    }

    // Add structured data
    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Add default website structured data if none provided
    if (!structuredData && type === "website") {
      const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Nova Casa Construção",
                 url: window.location.origin,
         logo: `${window.location.origin}/logo.png`,
        description: description,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: "Portuguese",
        },
        sameAs: [],
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(defaultStructuredData);
      document.head.appendChild(script);
    }
  }, [
    title,
    description,
    keywords,
    ogImage,
    currentUrl,
    finalCanonicalUrl,
    structuredData,
    type,
  ]);

  return null;
};

export default SEO;
